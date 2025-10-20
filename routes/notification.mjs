import {Router} from "express";
import { createNotification, getBroadcastNotifications } from "../controllers/notification.mjs";
import * as NotificationService from "../services/notification.mjs";
import * as NotificationRepository from "../repositories/notification.mjs";

const notificationRouter = Router()

// POST
notificationRouter.post('/', createNotification)

// GET
notificationRouter.get('/broadcast', getBroadcastNotifications)

notificationRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Route: Getting notifications for userId:', userId);
    
    // ทดสอบการเชื่อมต่อ database ก่อน
    const dbConnected = await NotificationRepository.testDatabaseConnection();
    if (!dbConnected) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    
    const notifications = await NotificationService.getNotifications(userId);
    console.log('Route: Successfully retrieved notifications');
    res.json(notifications);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ message: "Failed to get notifications", error: error.message });
  }
})

// PUT
notificationRouter.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await NotificationService.markAsRead(notificationId);
    res.json({ message: "Notification marked as read", data: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
})

export default notificationRouter