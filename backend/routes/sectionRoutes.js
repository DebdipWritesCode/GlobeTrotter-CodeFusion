import express from "express";
import {
  createSection,
  getSectionsByTripId,
  getSectionById,
  updateSection,
  deleteSection,
  createItineraryByAI,
} from "../controllers/sectionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createSection);
router.get("/trip/:tripId", authenticate, getSectionsByTripId);
router.get("/:id", authenticate, getSectionById);
router.put("/:id", authenticate, updateSection);
router.delete("/:id", authenticate, deleteSection);
router.post("/create-itinerary-by-ai", createItineraryByAI);

export default router;
