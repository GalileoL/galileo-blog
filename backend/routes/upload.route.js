import express, { json } from "express";
import {
  checkFastPass,
  initUpload,
  getStatus,
  uploadChunk,
  completeMerge,
} from "../controllers/upload.controller.js";

const router = express.Router();
const parseJson = json({ limit: "1mb" });

router.post("/check", parseJson, checkFastPass);
router.post("/init", parseJson, initUpload);
router.get("/:id/status", getStatus);
router.post("/:id/chunk", uploadChunk); // application/octet-stream
router.post("/:id/complete", completeMerge);

export default router;
