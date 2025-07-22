import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: String,
    read: { type: Boolean, default: false },
  }, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
