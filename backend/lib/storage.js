import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.join(__dirname, "..", "..");
export const DATA_DIR = path.join(ROOT, "storage");
export const TMP_DIR = path.join(DATA_DIR, "tmp");
export const FILES_DIR = path.join(DATA_DIR, "files");

// create storage directories if they don't exist
for (const p of [DATA_DIR, TMP_DIR, FILES_DIR]) {
  fs.mkdirSync(p, { recursive: true });
}

export const ensureDir = async (p) => {
  try {
    return await fsp.mkdir(p, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${p}:`, err);
  }
};

export const sanitizeFileName = (name) => {
  return path.basename(String(name)).replace(/[\\\/\0]/g, "_");
};

export const getUserId = (req) => {
  const uid = req?.auth?.userId || req.headers["x-user-id"] || "anonymous";
  return String(uid)
    .trim()
    .replace(/[^\w.-]/g, "_");
};

export const dirSize = async (dir) => {
  let total = 0;
  let entries = [];
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch (error) {
    return 0;
  }
  for (const element of entries) {
    const p = path.join(dir, element.name);
    if (element.isDirectory()) {
      total += await dirSize(p);
    } else {
      try {
        const stats = await fsp.stat(p);
        total += stats.size;
      } catch (error) {}
    }
  }
  return total;
};
