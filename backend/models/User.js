import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: false, unique: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
