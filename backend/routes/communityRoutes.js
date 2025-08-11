import express from "express";
import {
  createPost,
  getAllPosts,
  toggleLike,
  addComment
} from "../controllers/communityController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createPost);
router.get("/", getAllPosts);
router.post("/:postId/like", authenticate, toggleLike);
router.post("/:postId/comment", authenticate, addComment);

export default router;
