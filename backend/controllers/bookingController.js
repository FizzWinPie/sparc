import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import User from '../models/User.js';
import Notification from "../models/Notification.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ ev_owner_id: userId });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    return res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    const deletedBooking = await Booking.findOneAndDelete({ _id: id });
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res
      .status(200)
      .json({ message: `Booking ${id} was successfully deleted` });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      charger_listings_id,
      charger_listings_address,
      host_id,
      ev_owner_id,
      start_time,
      end_time,
      total_cost,
      status,
      payment_status,
      rating_by_driver,
      rating_by_host,
      battery_level,
      images,
    } = req.body;

    const existingslisting = await Listing.findById(charger_listings_id);
    if (!existingslisting) {
      return res
        .status(404)
        .json({ message: "Cannot book listing that doesn't exist" });
    }

    // TODO future: ensure no booking overlaps - time management
    
    const newBooking = new Booking({
      charger_listings_id,
      charger_listings_address,
      host_id,
      ev_owner_id,
      start_time,
      end_time,
      total_cost,
      status,
      payment_status,
      rating_by_driver,
      rating_by_host,
      battery_level,
      images,
    });
    const savedBooking = await newBooking.save();

    await Notification.create({
      userId: host_id,
      message: `New booking request from ${ev_owner_id}`,
      read: false,
    });

    return res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const prevStatus = booking.status;
    const updateFields = { ...req.body };

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (
      typeof updateFields.status === "string" &&
      updateFields.status !== prevStatus
    ) {
      let message = null;
      const s = updateFields.status.toLowerCase();
      if (s === "accepted") message = "Your booking was accepted 🎉";
      else if (s === "declined" || s === "rejected")
        message = "Your booking was not accepted.";
      else if (s === "cancelled" || s === "canceled")
        message = "Your booking was cancelled.";

      if (message) {
        try {
          await Notification.create({
            userId: updatedBooking.ev_owner_id,
            message,
            read: false,
          });
        } catch (e) {
          console.error("Create guest notification error:", e);
        }
      }
    }

    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getBookingsByHost = async (req, res) => {
  try {
    const hostId = req.params.hostId;
    const bookings = await Booking.find({ host_id: hostId });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const user = await User.findOne({ clerkId: booking.ev_owner_id });
        return {
          ...booking.toObject(),
          ev_owner_name: user?.firstName ?? "Unknown",
        };
      })
    );

    res.status(200).json(enrichedBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
