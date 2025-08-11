import express from "express";      
import { createTrip, getTripById, updateTrip, deleteTrip, getTripsByUserId, addActivityToTrip, removeActivityFromTrip } from "../controllers/tripController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTrip);
// This specific route must come BEFORE the parameterized /:id route
router.get("/user", authenticate, getTripsByUserId); 
router.get("/:id", getTripById);
router.put("/:id", authenticate, updateTrip);
router.delete("/:id", authenticate, deleteTrip);
router.post("/:tripId/activities", authenticate, addActivityToTrip);
router.delete("/:tripId/activities/:activityId", authenticate, removeActivityFromTrip);

export default router;