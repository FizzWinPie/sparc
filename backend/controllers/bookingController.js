import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

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
    // if (!booking) {
    //   return res.status(404).json({ error: "Booking not found" });
    // }
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
      images
    } = req.body;
    
    const existingslisting = await Listing.findById(charger_listings_id);
    if (!existingslisting) {
      return res
        .status(404)
        .json({ message: "Cannot book listing that doesn't exist" });
    }

    // const overlappingBooking = await Booking.findOne({
    //   charger_listings_id,
    //   $or: [
    //     {
    //       start_time: { $lt: new Date(end_time) },
    //       end_time: { $gt: new Date(start_time) },
    //     },
    //   ],
    // });

    // if (overlappingBooking) {
    //   return res
    //     .status(409)
    //     .json({ message: "Time slot already booked for this listing" });
    // }

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

    const updateFields = { ...req.body };

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
