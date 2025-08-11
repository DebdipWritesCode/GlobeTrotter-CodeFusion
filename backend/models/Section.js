import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  activities: [
    {
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    }
  ],
  budget: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

export default mongoose.model("Section", sectionSchema);
