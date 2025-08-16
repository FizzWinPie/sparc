import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  let conversation = await Conversation.find();
  res.status(200).json(conversation);
};

export const getConversationsByUserId = async (req, res) => {
  const { userId } = req.params;
  let conversation = await Conversation.find({ participants: userId })
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
  res.json(conversation);
};

export const createConversation = async (req, res) => {
  const { user1, user2, imageUrl, listingName } = req.body;
  
  let conversation = await Conversation.findOne({
    participants: { $all: [user1, user2] },
    listingName,
    imageUrl,
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [user1, user2], imageUrl: imageUrl, listingName: listingName });
  }

  res.status(201).json(conversation);
};

export const getMessagesByConversationID = async(req,res) => {
  const { conversationId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  res.json(messages);
};
