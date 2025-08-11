import express from "express";      
import { createTrip, getTripById, updateTrip, deleteTrip, getTripsByUserId, addActivityToTrip, removeActivityFromTrip } from "../controllers/tripController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTrip);
router.get("/:id", getTripById);
router.put("/:id",authenticate, updateTrip);
router.delete("/:id",authenticate, deleteTrip);
router.get("/user", authenticate, getTripsByUserId);
router.post("/:tripId/activities",authenticate, addActivityToTrip);
router.delete("/:tripId/activities/:activityId",authenticate, removeActivityFromTrip);

// AI generated route for trending trips
// router.get("/trending", getTrendingTrips);


export default router;