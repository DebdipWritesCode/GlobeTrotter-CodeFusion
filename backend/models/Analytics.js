import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalUsers: Number,
  totalTrips: Number,
  popularCities: [{ cityId: mongoose.Schema.Types.ObjectId, count: Number }],
  popularActivities: [{ activityId: mongoose.Schema.Types.ObjectId, count: Number }],
});

export default mongoose.model("Analytics", analyticsSchema);
