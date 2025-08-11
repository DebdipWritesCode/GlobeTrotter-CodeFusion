import Trip from "../models/Trip.js";
import mongoose from "mongoose";

export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req?.user?.userId;

    console.log("Creating trip for user:", userId);
    if (!userId || !title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trip = await Trip.create({
      userId,
      title,
      description,
      startDate,
      endDate,
      isPublic: false,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("userId", "name email")
      .populate("cities.cityId");

    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.coverPhoto = `/uploads/${req.file.filename}`;
    }

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedTrip)
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });

    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedTrip)
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing required query parameter: userId" });
    }

    const trips = await Trip.find({ userId }).populate("cities.cityId");

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addActivityToTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate, order } = req.body;

    if (!cityId || !startDate || !endDate || order === undefined) {
      return res.status(400).json({ message: "Missing required city fields" });
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip)
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });

    trip.cities.push({ cityId, startDate, endDate, order });
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeActivityFromTrip = async (req, res) => {
  try {
    const { tripId, activityId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip)
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });

    trip.cities = trip.cities.filter(
      (city) => city._id.toString() !== activityId
    );
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
