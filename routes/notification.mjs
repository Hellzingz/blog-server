import { Router } from "express";
import { createNotification, getAllNotifications, getNotificationsByUserId, markNotificationAsRead } from "../controllers/notification.mjs";
import { validateUserId } from "../middlewares/validation.mjs";

const notificationRouter = Router();

//POST Routes
notificationRouter.post('/', createNotification);

//GET Routes
notificationRouter.get('/', getAllNotifications);
notificationRouter.get('/:userId', validateUserId, getNotificationsByUserId);

//PUT Routes
notificationRouter.put('/:notificationId/read', markNotificationAsRead);

export default notificationRouter;