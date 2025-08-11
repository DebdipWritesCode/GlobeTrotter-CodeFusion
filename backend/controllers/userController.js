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

export const getUserById = async (req, res) => {}

export const getUserTrips = async (req, res) => {}

export const updateUser = async (req, res) => {}