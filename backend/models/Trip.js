import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  coverPhoto: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  isPublic: { type: Boolean, default: false },
  cities: [{
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    order: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trip', tripSchema);