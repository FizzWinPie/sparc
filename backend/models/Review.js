import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
   host_id: {
    type: String,
    required: true,
  },
  ev_owner_id: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;