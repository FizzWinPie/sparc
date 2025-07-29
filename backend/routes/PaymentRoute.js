import express from "express";
import { checkout, createTransaction, getTransactionsByUserId } from "../controllers/paymentController.js";

const router = express.Router();

router.post('/payment-sheet', checkout);
router.post('/transaction', createTransaction);
router.get('/transaction/:userId', getTransactionsByUserId);
export default router;