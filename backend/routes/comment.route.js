import express from "express";

import {
  getCommentsByPostId,
  createCommentByPostId,
  deleteCommentByCommentId,
} from "../controllers/comment.controller.js";
const router = express.Router();

router.get("/:postId", getCommentsByPostId);
router.post("/:postId", createCommentByPostId);
router.delete("/:commentId", deleteCommentByCommentId);

export default router;
