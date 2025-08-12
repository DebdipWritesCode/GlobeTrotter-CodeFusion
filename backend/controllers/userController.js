import Trip from "../models/Trip.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js"; // Assuming Cloudinary setup

export const uploadAvatar = async (req, res) => {
 try {
   if (!req.file) {
     return res.status(400).json({ message: "No file uploaded." });
   }


   const result = await cloudinary.uploader.upload(req.file.path, {
     folder: "avatars", // Optional folder in Cloudinary
     transformation: [{ width: 120, height: 120, crop: "fill" }], // Optional transformations
   });


   const user = await User.findByIdAndUpdate(
     req.user.userId, // Assuming user ID is in req.user after authentication
     { avatar: result.secure_url },
     { new: true }
   ).select("-password");


   if (!user) {
     return res.status(404).json({ message: "User not found." });
   }


   res.json({ message: "Avatar uploaded successfully.", avatar: user.avatar });
 } catch (error) {
   console.error("Error uploading avatar:", error);
   res.status(500).json({ message: "Failed to upload avatar." });
 }
};

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
   const updates = req.body;
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
      .select("title coverPhoto startDate endDate status") // fix incorrect fields
      .lean();
    res.json(Array.isArray(trips) ? trips : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

