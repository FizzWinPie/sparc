import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { host_id, ev_owner_id, rating, comment } = req.body;

  if (!host_id || !ev_owner_id || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const review = new Review({ host_id, ev_owner_id, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Server error" });
  }
};