import {Router} from "express";
import { createNotification, getAllNotifications } from "../controllers/notification.mjs";
import * as NotificationService from "../services/notification.mjs";

const notificationRouter = Router()

// POST
notificationRouter.post('/', createNotification)


// TEST: GET ALL NOTIFICATIONS
notificationRouter.get('/', getAllNotifications)

// GET NOTIFICATIONS BY USER ID
notificationRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await NotificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error) {
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