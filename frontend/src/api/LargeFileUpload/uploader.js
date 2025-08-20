// example：import { uploadLargeFile } from '@/api/upload/uploader'
//       await uploadLargeFile(file, { apiBase: '/api', concurrency: 4, userId, onProgress, onPhase, signal });

export async function uploadLargeFile(
  file,
  {
    apiBase = "/api",
    chunkSize = 5 * 1024 * 1024, // frontend initial value, will be finalized by server response
    concurrency = 4,
    userId, //  if not login, can pass a string for isolation; if logged in, can not pass
    onProgress = () => {}, // get progress [0,1]
    onPhase = () => {}, // show phase text
    signal, // can pass AbortController.signal to cancel
  } = {}
) {
  const headersJSON = { "Content-Type": "application/json" };
  const headersOctet = { "Content-Type": "application/octet-stream" };
  if (userId) {
    headersJSON["X-User-Id"] = userId;
    headersOctet["X-User-Id"] = userId;
  }

  // 1)    In web worker, calculate incremental SHA-256 (whole file) + per-chunk SHA-256
  onPhase("calculate hash SHA-256...");
  const { perChunkHashes, overallHash } = await hashInWorker(file, {
    chunkSize,
    signal,
  });

  // 2) check fast upload
  onPhase("check fast upload...");
  const pre = await fetch(`${apiBase}/upload/check`, {
    method: "POST",
    headers: headersJSON,
    body: JSON.stringify({ filename: file.name, size: file.size, overallHash }),
    signal,
  }).then((r) => r.json());

  if (pre.exists) {
    onProgress(1);
    return { ok: true, secondsPassed: true, url: pre.url, hash: overallHash };
  }

  // 3) init（get chunkSize from server end）
  onPhase("initialize upload session...");
  const init = await fetch(`${apiBase}/upload/init`, {
    method: "POST",
    headers: headersJSON,
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      mime: file.type,
      overallHash,
    }),
    signal,
  }).then((r) => r.json());

  const uploadId = init.uploadId;
  const serverChunkSize = init.chunkSize || chunkSize;
  const total = Math.ceil(file.size / serverChunkSize);

  // 4) check uploaded chunks
  const status = await fetch(`${apiBase}/upload/${uploadId}/status`, {
    headers: userId ? { "X-User-Id": userId } : undefined,
    signal,
  }).then((r) => r.json());
  const uploaded = new Set(status.uploaded || []);

  // initial
  let doneBytes = 0;
  for (const idx of uploaded) {
    const start = idx * serverChunkSize;
    const end = Math.min(start + serverChunkSize, file.size);
    doneBytes += end - start;
  }
  onProgress(doneBytes / file.size);

  // 5) concurrent upload chunks
  onPhase("uploading chunks...");
  let next = 0,
    inflight = 0,
    stopped = false;

  await new Promise((resolve, reject) => {
    const pump = () => {
      if (stopped) return;
      if (next >= total && inflight === 0) return resolve();

      while (inflight < concurrency && next < total && !stopped) {
        const index = next++;
        if (uploaded.has(index)) continue;

        inflight++;
        (async () => {
          const start = index * serverChunkSize;
          const end = Math.min(start + serverChunkSize, file.size);
          const blob = file.slice(start, end);
          const hash = perChunkHashes[index]; // Worker

          const resp = await fetch(
            `${apiBase}/upload/${uploadId}/chunk?index=${index}&hash=${hash}`,
            {
              method: "POST",
              headers: headersOctet,
              body: blob,
              signal,
            }
          ).then((r) => r.json());

          if (!(resp.ok || resp.dedup)) {
            throw new Error("chunk failed: " + JSON.stringify(resp));
          }

          doneBytes += end - start;
          onProgress(doneBytes / file.size);
        })()
          .then(() => {
            inflight--;
            pump();
          })
          .catch((err) => {
            stopped = true;
            reject(err);
          });
      }
    };
    pump();
  });

  // 6) merge
  onPhase("merging chunks...");
  const done = await fetch(`${apiBase}/upload/${uploadId}/complete`, {
    method: "POST",
    headers: userId ? { "X-User-Id": userId } : undefined,
    signal,
  }).then((r) => r.json());

  if (!(done.ok || done.already)) {
    throw new Error(done.error || "merge failed");
  }
  onProgress(1);
  return { ...done, secondsPassed: false };
}

// ——  “calculate per-chunk hash + incremental overall hash” —— //
function hashInWorker(file, { chunkSize, signal }) {
  return new Promise((resolve, reject) => {
    // bundler-friendly Worker import method (compatible with Vite/Webpack)
    const worker = new Worker(new URL("./hash.worker.js", import.meta.url), {
      type: "module",
    });
    const cleanup = () => worker.terminate();

    if (signal) {
      const onAbort = () => {
        cleanup();
        reject(new DOMException("Aborted", "AbortError"));
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }

    worker.onmessage = (e) => {
      const { type } = e.data || {};
      if (type === "done") {
        cleanup();
        resolve(e.data);
      }
      // "If you need to display the hash progress, you can listen for type === 'hash-progress' here."
    };
    worker.onerror = (err) => {
      cleanup();
      reject(err);
    };

    worker.postMessage({ file, chunkSize });
  });
}
