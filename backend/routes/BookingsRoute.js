import express from "express";
import { createBooking, deleteBooking, getBooking, getBookings, getBookingsByUser, updateBooking, getBookingsByHost } from "../controllers/bookingController.js";

const router = express.Router();

router.get('/bookings', getBookings);
router.get('/bookings/:id', getBooking);
router.get('/bookings/user/:userId', getBookingsByUser);
router.post('/bookings', createBooking);
router.delete('/bookings/:id', deleteBooking);
router.put('/bookings/:id', updateBooking);
router.get('/bookings/host/:hostId', getBookingsByHost);

export default router;