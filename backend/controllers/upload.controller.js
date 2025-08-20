import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import { rimraf } from "rimraf";
import * as crypto from "node:crypto";

import {
  DEFAULT_CHUNK_SIZE,
  MAX_UPLOAD_SIZE,
  USER_QUOTA_BYTES,
} from "../lib/config.js";
import {
  TMP_DIR,
  FILES_DIR,
  ensureDir,
  sanitizeFileName,
  getUserId,
  dirSize,
} from "../lib/storage.js";
import { getUserSemaphore, globalSemaphore } from "../lib/concurrency.js";
import { withFilelock } from "../lib/locks.js";
import { makeSha256 } from "../lib/hash.js";

// A: check fast pass
export const checkFastPass = async (req, res) => {
  const userId = getUserId(req);
  const { filename, size, overallHash } = req.body || {};
  if (!filename || !Number.isFinite(size) || !overallHash) {
    return res.status(400).json({
      error: "Invalid request: filename/size/overallHash are required",
    });
  }

  const userFiles = path.join(FILES_DIR, userId);
  await ensureDir(userFiles);
  const safeName = sanitizeFileName(filename);
  const finalName = `${overallHash}__${safeName}`;
  const finalPath = path.join(userFiles, finalName);

  if (fs.existsSync(finalPath)) {
    const stat = await fsp.stat(finalPath);
    if (stat.size === size) {
      return res.status(409).json({
        error: "File already exists",
        exists: true,
        url: `/files/${userId}/${finalName}`,
      });
    }
  }

  res.json({ error: "File does not exist", exists: false });
};

// B: init upload
export const initUpload = async (req, res) => {
  const userId = getUserId(req);
  const { filename, size, mine, overallHash } = req.body || {};
  if (!filename || !Number.isFinite(size) || !overallHash) {
    return res.status(400).json({
      error: "Invalid request: filename/size/overallHash are required",
    });
  }
  if (size > MAX_UPLOAD_SIZE) {
    return res.status(413).json({
      error: "File size exceeds maximum limit",
      limit: MAX_UPLOAD_SIZE,
    });
  }

  const userTmp = path.join(TMP_DIR, userId);
  const userFiles = path.join(FILES_DIR, userId);
  await Promise.all([ensureDir(userTmp), ensureDir(userFiles)]);

  // get the current usage for the user
  const used = (await dirSize(userTmp)) + (await dirSize(userFiles));
  // if current usage and new file size exceeds quota, return error
  if (used + size > USER_QUOTA_BYTES) {
    return res.status(403).json({
      error: "User quota exceeded",
      used: used,
      quota: USER_QUOTA_BYTES,
    });
  }

  //   create upload session, uuid
  const uploadId = crypto.randomUUID();
  const dir = path.join(userTmp, uploadId);
  await ensureDir(dir);

  const safeName = sanitizeFileName(filename);
  await fsp.writeFile(
    path.join(dir, "meta.json"),
    JSON.stringify(
      {
        userId,
        filename,
        safeName,
        size,
        mine,
        chunkSize: DEFAULT_CHUNK_SIZE,
        overallHash,
        ts: Date.now(),
      },
      null,
      2
    )
  );
  res.json({ uploadId, chunkSize: DEFAULT_CHUNK_SIZE });
};

// c: get chunks that already uploaded
export const getStatus = async (req, res) => {
  const userId = getUserId(req);
  const dir = path.join(TMP_DIR, userId, req.params.id);
  try {
    const parts = (await fsp.readdir(dir))
      .filter((f) => f.endsWith(".part"))
      .map((f) => parseInt(f.split(".")[0], 10))
      .sort((a, b) => a - b);
    res.json({ uploaded: parts });
  } catch (error) {
    res.status(404).json({ error: "Upload session not found" });
  }
};

// d: upload chunk (binary stream + concurrency control + soft limit + idempotency)
export const uploadChunk = async (req, res) => {
  const userId = getUserId(req);
  const userSemaphore = getUserSemaphore(userId);
  const { id } = req.params;
  const index = Number(req.query.index);
  const expectedHash = String(req.query.hash || "").trim();
  if (!Number.isFinite(index)) {
    return res.status(400).json({ error: "index required" });
  }

  //   acquire locks
  await globalSemaphore.acquire();
  await userSemaphore.acquire();
  try {
    const dir = path.join(TMP_DIR, userId, id);
    const metaPath = path.join(dir, "meta.json");

    let meta;
    meta = JSON.parse(await fsp.readFile(metaPath, "utf8"));

    //    quota fallback (can limit even without content-length)
    const userTmp = path.join(TMP_DIR, userId);
    const userFiles = path.join(FILES_DIR, userId);
    const used = (await dirSize(userTmp)) + (await dirSize(userFiles));
    if (used > USER_QUOTA_BYTES) {
      return res.status(403).json({
        error: "User quota exceeded",
        used: used,
        quota: USER_QUOTA_BYTES,
      });
    }

    //   create part path file and if it already exist, return dedup response
    const partPath = path.join(dir, `${index}.part`);
    if (fs.existsSync(partPath)) {
      return res.json({ ok: true, dedup: true });
    }

    //   update timestamps, in case of clean up in mistake
    meta.ts = Date.now();
    await fsp.writeFile(metaPath, JSON.stringify(meta, null, 2));

    const hasher = makeSha256();
    const tmpPath = `${partPath}.tmp`;
    const ws = fs.createWriteStream(tmpPath, { flags: "wx" });

    //   soft limit: less than 2*chunksize
    const maxBytes = (meta.chunkSize || DEFAULT_CHUNK_SIZE) * 2;
    let written = 0;

    req.on("data", (chunk) => {
      written += chunk.length;
      if (written > maxBytes) {
        ws.destroy(new Error("Soft limit exceeded, chunk too large"));
        // res.status(413).json({ error: "Soft limit exceeded, chunk too large" });
        req.destroy();
        return;
      }
      hasher.update(chunk);
    });

    ws.on("error", async (err) => {
      if (err?.code === "EEXIST") {
        if (fs.existsSync(partPath)) {
          return res.json({ ok: true, dedup: true });
        }
        await fsp.rm(tmpPath, { force: true }).catch(() => {});
        return res.status(500).json({ error: err.message });
      }
    });

    req.pipe(ws);

    ws.on("finish", async () => {
      const digest = hasher.digest("hex");
      if (expectedHash && digest !== expectedHash) {
        await fsp.rm(tmpPath, { force: true });
        return res.status(400).json({
          error: "Hash mismatch",
          expected: expectedHash,
          got: digest,
        });
      }
      await fsp.rename(tmpPath, partPath);
      res.json({ ok: true, hash: digest });
    });
  } finally {
    userSemaphore.release();
    globalSemaphore.release();
  }
};

// Complete merge (lock + all chunks present + double verification + cleanup)
export const completeMerge = async (req, res) => {
  const userId = getUserId(req);
  const dir = path.join(TMP_DIR, userId, req.params.id);
  const metaPath = path.join(dir, "meta.json");

  let meta;
  try {
    meta = JSON.parse(await fsp.readFile(metaPath, "utf8"));
  } catch (error) {
    return res.status(404).json({ error: "Upload id not found" });
  }

  const { safeName, size, overallHash, chunkSize } = meta;
  const userFiles = path.join(FILES_DIR, userId);
  await ensureDir(userFiles);

  const lockPath = path.join(dir, ".merge.lock");
  try {
    const result = await withFilelock(lockPath, async () => {
      const finalName = `${overallHash}__${safeName}`;
      const finalPath = path.join(userFiles, finalName);

      if (fs.existsSync(finalPath)) {
        const stat = await fsp.stat(finalPath);
        return {
          already: true,
          size: stat.size,
          url: `/files/${userId}/${finalName}`,
        };
      }

      //  chunk manifest and verification
      const parts = (await fsp.readdir(dir))
        .filter((file) => file.endsWith(".part"))
        .map((f) => parseInt(f.split(".")[0], 10))
        .sort((a, b) => a - b);

      const expectedParts = Math.ceil(size / chunkSize);
      if (
        parts.length !== expectedParts ||
        parts[0] !== 0 ||
        parts.at(-1) !== expectedParts - 1
      ) {
        return res.status(400).json({
          error: "parts missing or index gap",
          expectedParts: expectedParts,
          parts: parts,
        });
      }

      for (const idx of parts) {
        const p = path.join(dir, `${idx}.part`);
        const st = await fsp.stat(p);
        const max =
          idx === expectedParts - 1
            ? size - (expectedParts - 1) * chunkSize
            : chunkSize;

        if (!(st.size <= max && st.size > 0)) {
          return {
            error: "invalid part size",
            index: idx,
            got: st.size,
            expectMax: max,
          };
        }
      }

      //   combine and total hash
      const totalHasher = makeSha256();
      const ws = fs.createWriteStream(finalPath, { flags: "wx" });

      for (const idx of parts) {
        const partPath = path.join(dir, `${idx}.part`);
        await new Promise((resolve, reject) => {
          const rs = fs.createReadStream(partPath, {
            highWaterMark: 2 * 1024 * 1024,
          });
          rs.on("data", (buf) => totalHasher.update(buf));
          rs.on("error", reject);
          rs.on("end", resolve);
          rs.pipe(ws, { end: false });
        });
      }
      await new Promise((r) => ws.end(r));
      const totalHash = totalHasher.digest();

      const stat = await fsp.stat(finalPath);
      if (stat.size !== size || totalHash !== overallHash) {
        await fsp.rm(finalPath, { force: true });
        return {
          error: "final file invalid",
          got: {
            size: stat.size,
            hash: totalHash,
          },
          expect: {
            size: size,
            hash: overallHash,
          },
        };
      }

      await rimraf(dir);
      return {
        ok: true,
        url: `/files/${userId}/${finalName}`,
        size: stat.size,
        hash: totalHash,
      };
    });

    if (result.error) {
      return res.status(400).json(result);
      res.json(result);
    }
  } catch (error) {
    const code = error?.status || 500;
    res.status(code).json({ error: error.message || "merge failed" });
  }
};
