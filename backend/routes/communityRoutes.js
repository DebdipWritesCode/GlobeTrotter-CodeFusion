import express from "express";
import {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  deleteComment
} from "../controllers/communityController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createPost);
router.get("/", getAllPosts);
router.post("/:postId/like", authenticate, toggleLike);
router.post("/:postId/comment", authenticate, addComment);
router.delete("/:postId/comments/:commentId", deleteComment);

export default router;
