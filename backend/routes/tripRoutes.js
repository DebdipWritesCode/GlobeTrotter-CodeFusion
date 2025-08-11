import express from "express";      
const { createTrip, getTripById, updateTrip, deleteTrip, getTripsByUserId, addActivityToTrip, removeActivityFromTrip } = require("../controllers/tripController.js");


const router = express.Router();

router.post("/", createTrip);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.get("/user/:userId", getTripsByUserId);
router.post("/:tripId/activities", addActivityToTrip);
router.delete("/:tripId/activities/:activityId", removeActivityFromTrip);

// AI generated route for trending trips
router.get("/trending", getTrendingTrips);


export default router;