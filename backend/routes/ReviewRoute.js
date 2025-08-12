import express from "express";
import {
  createReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post('/reviews', createReview);  // POST /api/reviews

export default router;