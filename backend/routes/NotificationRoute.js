import express from 'express';
import { getNotifications, markRead } from '../controllers/notificationController.js';
const router = express.Router();

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markRead);

export default router;
