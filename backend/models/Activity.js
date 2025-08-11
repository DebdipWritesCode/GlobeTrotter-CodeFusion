import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  category: { type: String, enum: ['sightseeing', 'food', 'adventure', 'culture', 'other'] },
  cost: { type: Number },
  duration: { type: Number }, // in hours
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);
