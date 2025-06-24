import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  host_id: { type: String, required: true },
  charger_type: { type: String, required: true },
  power_output_kw: { type: Number, required: true },
  connector_type: { type: String, required: true },
  address: { type: String, required: true },
  availability_schedule: { type: String, required: true },
  price_per_hour: { type: Number, required: true },
  min_price: { type: Number, required: true },
  images: { type: String },
  is_active: { type: Boolean, default: true },
  instructions: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;