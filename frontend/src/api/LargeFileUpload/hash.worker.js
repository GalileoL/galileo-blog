// frontend/src/api/upload/hash.worker.js
// Incremental SHA-256 (whole file): uses hash-wasm's createSHA256()
// Per-chunk hash: uses WebCrypto crypto.subtle.digest('SHA-256', chunkBuffer)

import { createSHA256 } from "hash-wasm";

const hex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256Chunk = async (buffer) => {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return hex(digest);
};

self.onmessage = async (e) => {
  const { file, chunkSize } = e.data;
  const total = Math.ceil(file.size / chunkSize);

  // 1) Incremental whole file hash
  const hasher = await createSHA256();
  hasher.init();

  // 2) Per-chunk hash list for server-side verification
  const perChunkHashes = new Array(total);

  // Read in chunks: feed the incremental hasher while computing the chunk hash
  for (let i = 0; i < total; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const buf = await file.slice(start, end).arrayBuffer(); // Only load the current chunk
    const u8 = new Uint8Array(buf);

    // Incremental whole file hash
    hasher.update(u8);

    // Per-chunk hash
    perChunkHashes[i] = await sha256Chunk(buf);

    // Optional: report hash progress (to main thread)
    // if ((i & 7) === 0) self.postMessage({ type: 'hash-progress', index: i, total });
  }

  const overallHash = hasher.digest("hex");
  self.postMessage({ type: "done", perChunkHashes, overallHash });
};
