import * as fsp from "node:fs/promises";
import path from "node:path";
import { rimraf } from "rimraf";
import { TMP_DIR } from "./storage.js";
import { TMP_EXPIRE_MS } from "./config.js";

export const sweepTmp = async () => {
  try {
    const users = await fsp.readdir(TMP_DIR);
    const now = Date.now();
    for (const userId of users) {
      const userTmp = path.join(TMP_DIR, userId);
      let uploads = [];
      try {
        uploads = await fsp.readdir(userTmp);
      } catch (error) {
        continue;
      }

      for (const uploadId of uploads) {
        const uploadPath = path.join(userTmp, uploadId);
        const metaPath = path.join(uploadPath, "meta.json");
        try {
          const meta = JSON.parse(await fsp.readFile(metaPath, "utf-8"));
          if (now - (meta.ts || 0) > TMP_EXPIRE_MS) {
            await rimraf(uploadPath);
          }
        } catch (error) {
          await rimraf(uploadPath);
        }
      }
    }
  } catch (error) {
    console.error("Error sweeping temporary directories:", error);
  }
};

export const scheduleSweep = () => {
  setInterval(sweepTmp, 60 * 60 * 1000);
};
