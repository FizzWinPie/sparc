import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";
import listingRoutes from "./routes/ListingsRoutes.js";
import bookingRoutes from "./routes/BookingsRoute.js";
import paymentRoutes from "./routes/PaymentRoute.js";
import reviewRoutes from "./routes/ReviewRoute.js";
import conversationRoutes from "./routes/ConversationRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", listingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);
app.use("/api", conversationRoutes);

// Socket.IO chat logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });

  socket.on("sendMessage", async ({ conversationId, sender, text }) => {
    try {
      // Save message
      const message = await Message.create({
        conversation: conversationId,
        sender,
        text,
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });

      // Broadcast new message to room
      io.to(conversationId).emit("newMessage", message);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Could not send message");
    }
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));
