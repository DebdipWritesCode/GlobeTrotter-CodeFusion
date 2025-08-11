import Section from "../models/Section.js";
import axios from "axios";
import Activity from "../models/Activity.js";

export const createSection = async (req, res) => {
  try {
    const { tripId, name, description, budget, startDate, endDate, activities } = req.body;

    if (!tripId || !name || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const section = await Section.create({
      tripId,
      name,
      description,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      activities: activities || []
    });

    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSectionsByTripId = async (req, res) => {
  try {
    const sections = await Section.find({ tripId: req.params.tripId });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSection = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const section = await Section.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createItineraryByAI = async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;

    if (!name || !description || !start_date || !end_date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Fetch all activities from DB
    const activities = await Activity.find({}); // adjust DB query as needed

    // 2️⃣ Prepare payload for FastAPI
    const itineraryPayload = {
      name,
      description,
      start_date,
      end_date,
      activities // Should match the FastAPI `Activity` model shape
    };

    // 3️⃣ Send to FastAPI
    const { data: itineraryResponse } = await axios.post(
      "http://localhost:8000/v1/itinerary",
      itineraryPayload
    );

    // 4️⃣ Return FastAPI response to client
    return res.status(200).json(itineraryResponse);

  } catch (error) {
    console.error("Error creating itinerary by AI:", error.message);
    return res.status(500).json({ error: "Failed to create itinerary" });
  }
};