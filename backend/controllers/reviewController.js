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

export const getReviewsByHost = async (req, res) => {
  const { hostId } = req.params;
  
  try {
    const reviews = await Review.find({ host_id: hostId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAverageRatingByHost = async (req, res) => {
  const { hostId } = req.params;

  try {
    const result = await Review.aggregate([ 
      { $match: { host_id: hostId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const average = Math.round((result[0]?.avgRating || 0) * 10) / 10;

    res.status(200).json({ average });
  } catch (error) {
    console.error("Failed to get average rating", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteReviewById = async (req, res) => {
  const { reviewId } = req.params;


  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Server error" });
  }
};