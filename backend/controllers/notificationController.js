import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const notes = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json(notes);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, message, read = false } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }
    const note = await Notification.create({ userId, message, read });
    res.status(201).json(note);
  } catch (err) {
    console.error('Create notification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.sendStatus(204);
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const count = await Notification.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
