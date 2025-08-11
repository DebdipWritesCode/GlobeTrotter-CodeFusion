import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  dayNumber: { type: Number, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  activities: [{
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    time: String,
    notes: String,
    cost: Number
  }],
  totalDayCost: Number
});

export default mongoose.model("Itinerary", itinerarySchema);
