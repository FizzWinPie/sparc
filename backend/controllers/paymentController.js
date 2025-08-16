import Stripe from "stripe";
import Payment from "../models/Payment.js";

export const checkout = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
    apiVersion: "2024-09-30.acacia",
  });
  try {
    // Create a new customer
    const customer = await stripe.customers.create();

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-09-30.acacia" }
    );

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      // return_url: "" needed for apple
    });

    // Return all needed info to client
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { receiver, payer, bookingId, amount } = req.body;

    if (!receiver || !payer || !bookingId || !amount) {
      return res.status(400).json({ error: "Missing required field(s)" });
    }

    const payment = new Payment({ receiver, payer, bookingId, amount });
    const savedPayment = await payment.save();
    
    // TODO future: Maybe update user
    
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating a transaction:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions that have the userId in them (whether they are receiver or payer)
export const getTransactionsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing required field(s)" });
    }
    const transactions = await Payment.find({
      $or: [{ receiver: userId }, { payer: userId }],
    });

    let balance = 0;
    transactions.forEach((txn) => {
      if (txn.receiver === userId) {
        balance += txn.amount;
      } else if (txn.payer === userId) {
        balance -= txn.amount;
      }
    });

    res.status(200).json({ transactions, balance });
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ error: error.message });
  }
};
