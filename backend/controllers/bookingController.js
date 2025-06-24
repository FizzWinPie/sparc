import Booking from '../models/Booking.js';

/* ----------------------------  CREATE  ---------------------------- */
export const createBooking = async (req, res) => {
  const {
    charger_listings_id,
    host_id,
    ev_owner_id,
    start_time,
    end_time,
    total_cost,
  } = req.body;

  if (
    !charger_listings_id ||
    !host_id ||
    !ev_owner_id ||
    !start_time ||
    !end_time ||
    total_cost == null
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const booking = new Booking({
      charger_listings_id,
      host_id,
      ev_owner_id,
      start_time,
      end_time,
      total_cost,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/* -----------------------------  READ  ----------------------------- */
export const getBookings = async (req, res) => {
  const filter = req.query.host_id ? { host_id: req.query.host_id } : {};

  try {
    const bookings = await Booking.find(filter).sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ----------------------------  UPDATE  ---------------------------- */
export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Invalid' });
  }
};

/* ----------------------------  DELETE  ---------------------------- */
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
