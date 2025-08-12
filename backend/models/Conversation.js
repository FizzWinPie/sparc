import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // user IDs
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;