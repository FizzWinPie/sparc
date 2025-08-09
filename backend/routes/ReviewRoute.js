import express from "express";
import {
  createReview,
  getReviewsByHost,
  deleteReviewById,
  getAverageRatingByHost,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post('/reviews', createReview);  // POST /api/reviews
router.get('/reviews/:hostId', getReviewsByHost);  // GET /api/reviews/:hostId
router.get("/reviews/average/:hostId", getAverageRatingByHost); // GET /api/:hostId
router.delete('/reviews/:reviewId', deleteReviewById);  // DELETE /api/reviews/:reviewId


export default router;