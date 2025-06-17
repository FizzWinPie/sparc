import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/routes", usersRoutes);

//Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));
