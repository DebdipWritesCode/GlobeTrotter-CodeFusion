import Trip from "../models/Trip.js";
import User from "../models/User.js";


export const completeProfile = async (req, res) => {
  const { city, country } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { city, country },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const updates = req.body; // { name, avatar, languagePreference, savedDestinations }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.id })
      .select("name startDate endDate coverPhoto destinations")
      .lean();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

