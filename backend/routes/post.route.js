import express from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", createPost);
router.delete("/:id", deletePost);

export default router;
