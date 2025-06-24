import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    _id:                 { type: String, alias: 'id' },

    charger_listings_id: { type: String, required: true },
    host_id:             { type: String, required: true },
    ev_owner_id:         { type: String, required: true },

    start_time:          { type: Date,   required: true },
    end_time:            { type: Date,   required: true },
    total_cost:          { type: mongoose.Decimal128, required: true },

    status: {type: String, required: true},
    payment_status: {type: String, required: true},

    rating_by_driver: { type: Number, min: 1, max: 5 }, 
    rating_by_host:   { type: Number, min: 1, max: 5 }, 
  }, { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
