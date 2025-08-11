import mongoose from "mongoose";
import Section from "../models/Section.js";
import Activity from "../models/Activity.js";
import axios from "axios";

export const createSection = async (req, res) => {
  try {
    let sectionsData = req.body;

    // Convert to array if single object
    if (!Array.isArray(sectionsData)) {
      sectionsData = [sectionsData];
    }

    // Validate required fields for each section
    for (const sec of sectionsData) {
      if (
        !sec.tripId ||
        !sec.name ||
        !sec.description ||
        !sec.startDate ||
        !sec.endDate
      ) {
        return res
          .status(400)
          .json({ message: "Missing required fields in one or more sections" });
      }
    }

    // Prepare sections for DB insert (convert dates, set defaults)
    const preparedSections = sectionsData.map((sec) => ({
      tripId: sec.tripId,
      name: sec.name,
      description: sec.description,
      budget: sec.budget || 0,
      startDate: new Date(sec.startDate),
      endDate: new Date(sec.endDate),
      activities: sec.activities || [],
    }));

    // Insert many if multiple, or create single if one
    let createdSections;
    if (preparedSections.length === 1) {
      createdSections = await Section.create(preparedSections[0]);
      return res.status(201).json(createdSections);
    } else {
      createdSections = await Section.insertMany(preparedSections);
      return res.status(201).json({
        message: `${createdSections.length} sections created successfully`,
        data: createdSections,
      });
    }
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

    if (updateData.startDate)
      updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const section = await Section.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

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
    const { name, description, start_date, end_date, tripId } = req.body;

    if (!name || !description || !start_date || !end_date || !tripId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure tripId is ObjectId
    const tripObjectId = new mongoose.Types.ObjectId(tripId);

    // 1️⃣ Fetch all activities from DB
    const activitiesFromDB = await Activity.find({});

    // Create lookup map by lowercase name
    const activityMap = {};
    activitiesFromDB.forEach((act) => {
      activityMap[act.name.trim().toLowerCase()] = act._id;
    });

    // 2️⃣ Prepare payload for FastAPI
    const itineraryPayload = {
      name,
      description,
      start_date,
      end_date,
      activities: activitiesFromDB, // matches FastAPI's Activity model
    };

    // 3️⃣ Call FastAPI
    const { data: itineraryResponse } = await axios.post(
      "http://localhost:8000/v1/itinerary",
      itineraryPayload
    );

    // 4️⃣ Transform AI response → DB schema
    const aiSections = itineraryResponse.sections || [];

    const preparedSections = aiSections.map((sec) => ({
      tripId: tripObjectId,
      name: sec.name,
      description: sec.description,
      budget: sec.budget || 0,
      startDate: new Date(sec.start_date),
      endDate: new Date(sec.end_date),
      activities: (sec.activities || []).map((a) => {
        let mappedId = null;

        // Prefer AI-provided activityId if it matches DB
        if (a.activityId && mongoose.Types.ObjectId.isValid(a.activityId)) {
          mappedId = new mongoose.Types.ObjectId(a.activityId);
        }
        // Otherwise match by name
        else if (a.name) {
          mappedId = activityMap[a.name.trim().toLowerCase()] || null;
        }

        return { activityId: mappedId };
      }),
    }));

    // 5️⃣ Insert into DB
    const createdSections = await Section.insertMany(preparedSections);

    // 6️⃣ Respond with saved docs
    return res.status(201).json({
      message: `${createdSections.length} sections created successfully`,
      data: createdSections,
    });
  } catch (error) {
    console.error("Error creating itinerary by AI:", error.message);
    return res.status(500).json({ error: "Failed to create itinerary" });
  }
};
