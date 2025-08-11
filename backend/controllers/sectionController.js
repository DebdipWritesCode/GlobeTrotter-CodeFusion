import Section from "../models/Section.js";

export const createSection = async (req, res) => {
  try {
    let sectionsData = req.body;

    // Convert to array if single object
    if (!Array.isArray(sectionsData)) {
      sectionsData = [sectionsData];
    }

    // Validate required fields for each section
    for (const sec of sectionsData) {
      if (!sec.tripId || !sec.name || !sec.description || !sec.startDate || !sec.endDate) {
        return res.status(400).json({ message: "Missing required fields in one or more sections" });
      }
    }

    // Prepare sections for DB insert (convert dates, set defaults)
    const preparedSections = sectionsData.map(sec => ({
      tripId: sec.tripId,
      name: sec.name,
      description: sec.description,
      budget: sec.budget || 0,
      startDate: new Date(sec.startDate),
      endDate: new Date(sec.endDate),
      activities: sec.activities || []
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
        data: createdSections
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
