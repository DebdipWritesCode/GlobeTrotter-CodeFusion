import express from "express";      
import { createTrip, getTripById, updateTrip, deleteTrip, getTripsByUserId, addActivityToTrip, removeActivityFromTrip } from "../controllers/tripController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTrip);

// router.get("/:id", getTripById);
router.put("/:id",authenticate, updateTrip);

router.get("/get/:id", getTripById);
// router.put("/update/:id",authenticate, updateTrip);
router.put("/edit/:id", authenticate, upload.single("coverPhoto"), updateTrip);

router.delete("/:id",authenticate, deleteTrip);
router.get("/user", authenticate, getTripsByUserId);
router.post("/:tripId/activities",authenticate, addActivityToTrip);
router.delete("/:tripId/activities/:activityId",authenticate, removeActivityFromTrip);

export default router;