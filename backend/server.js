import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";
import listingRoutes from "./routes/ListingsRoutes.js";
import bookingRoutes from "./routes/BookingsRoute.js";
import paymentRoutes from "./routes/PaymentRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", listingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));
