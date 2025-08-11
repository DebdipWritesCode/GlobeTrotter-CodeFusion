import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} from "../controllers/activityController.js";

const router = express.Router();

router.post("/", authenticate, createActivity); 
router.get("/", authenticate,getAllActivities);
router.get("/:id", authenticate,getActivityById);
router.put("/:id", authenticate, updateActivity);
router.delete("/:id", authenticate, deleteActivity);

export default router;
