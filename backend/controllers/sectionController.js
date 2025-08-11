import Section from "../models/Section.js";

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
