import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  charger_listings_id: { type: String, required: true },
  charger_listings_address: { type: String, required: true },
  host_id: { type: String, required: true },
  ev_owner_id: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  total_cost: { type: Number, required: true },
  status: { type: String, required: true },
  payment_status: { type: String, required: true },
  rating_by_driver: { type: Number },
  rating_by_host: { type: Number },
  battery_level: { type: String },
  images: { type: String },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
