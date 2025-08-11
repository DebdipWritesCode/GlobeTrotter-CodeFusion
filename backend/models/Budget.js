import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  transport: { type: Number, default: 0 },
  stay: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  meals: { type: Number, default: 0 },
  other: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

export default mongoose.model("Budget", budgetSchema);
