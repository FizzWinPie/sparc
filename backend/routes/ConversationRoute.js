import express from "express";
import { getConversations, getConversationsByUserId, getMessagesByConversationID } from "../controllers/conversationController.js";
import { createConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/conversations/:userId", getConversationsByUserId);
router.get("/conversations/:conversationId/messages", getMessagesByConversationID);
router.post("/conversations", createConversation);

export default router;