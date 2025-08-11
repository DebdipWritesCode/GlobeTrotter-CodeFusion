import express from "express";

const { createItinerary, getItineraryById, updateItinerary, deleteItinerary, getItinerariesByTripId, addActivityToItinerary, removeActivityFromItinerary } = require("../controllers/itineraryController.js");

const router = express.Router();

router.post("/", createItinerary);
router.put("/:id", updateItinerary);
router.delete("/:id", deleteItinerary);
router.get("/trip/:tripId", getItinerariesByTripId);
router.get("/:id", getItineraryById);
router.post("/:itineraryId/activities", addActivityToItinerary);
router.delete("/:itineraryId/activities/:activityId", removeActivityFromItinerary);


export default router;