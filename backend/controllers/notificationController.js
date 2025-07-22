import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { hostId } = req.query;
    const notes = await Notification.find({ hostId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Fetch notifications error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.sendStatus(200);
  } catch (err) {
    console.error('Mark read error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
