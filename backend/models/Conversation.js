import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  imageUrl: { type: String },
  listingName: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
