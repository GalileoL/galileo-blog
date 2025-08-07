import express from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
  uploadAuth,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", createPost);
router.delete("/:id", deletePost);

export default router;
