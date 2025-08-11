import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
}

export default mongoose.model('User', userSchema);