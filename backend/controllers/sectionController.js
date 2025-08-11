import Section from "../models/Section.js";

export const createSection = async (req, res) => {
  try {
    const { tripId, name, description, budget } = req.body;
    if (!tripId || !name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const section = await Section.create({ tripId, name, description, budget });
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
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
