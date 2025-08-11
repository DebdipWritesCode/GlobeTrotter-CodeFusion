import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  title: String,
  date: Date,
  type: { type: String, enum: ['trip', 'activity', 'reminder'] }
});

export default mongoose.model("CalendarEvent", calendarEventSchema);
