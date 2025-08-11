import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  costIndex: { type: Number },
  popularityScore: { type: Number },
  description: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('City', citySchema);