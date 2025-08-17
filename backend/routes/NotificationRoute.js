import express from 'express';
import {
  getNotifications,
  createNotification,
  markRead,
  getUnreadCount,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/notifications', getNotifications);
router.get('/notifications/unread-count', getUnreadCount);
router.post('/notifications', createNotification);
router.put('/notifications/:id/read', markRead);

export default router;
