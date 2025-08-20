import * as fsp from "node:fs/promises";

export const withFilelock = async (lockPath, fn) => {
  let handle;
  try {
    // get handle, "w" means write, "x" means exclusive
    handle = await fsp.open(lockPath, "wx");
  } catch (error) {
    if (error?.code === "EEXIST") {
      const err = new Error("locked");
      err.status = 409;
      throw err;
    }
    throw error;
  }
  try {
    await fn();
  } finally {
    // release the lock
    await handle?.close().catch(() => {});
    await fsp.rm(lockPath, { force: true }).catch(() => {});
  }
};
