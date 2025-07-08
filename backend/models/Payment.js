import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  receiver: { type: String, required: true },
  payer: { type: String, required: true },
  bookingId: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
