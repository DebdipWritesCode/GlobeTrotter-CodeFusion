import Activity from "../models/Activity.js";

export const createActivity = async (req, res) => {
  try {
    const { name, description, cityId, category, cost, duration, images } = req.body;

    if (!name || !cityId) {
      return res.status(400).json({ message: "Name and cityId are required" });
    }

    const activity = await Activity.create({
      name,
      description,
      cityId,
      category,
      cost,
      duration,
      images
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate("cityId", "name country");
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("cityId", "name country");
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedActivity) return res.status(404).json({ message: "Activity not found" });
    res.json(updatedActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
