import * as NotificationRepository from "../repositories/notification.mjs";

export async function createNotification(notificationData) {
  try {
    const result = await NotificationRepository.createNotification(notificationData);
    return result;
  } catch (error) {
    throw new Error("Server could not create notification");
  }
}

export async function getNotifications(userId) {
  try {
    const result = await NotificationRepository.getNotifications(userId);
    return result;
  } catch (error) {
    throw new Error("Server could not get notifications");
  }
}

export async function markAsRead(notificationId) {
  try {
    const result = await NotificationRepository.markAsRead(notificationId);
    return result;
  } catch (error) {
    throw new Error("Server could not mark notification as read");
  }
}
export async function getAllNotifications() {
  try {
    const result = await NotificationRepository.getAllNotifications();
    return result;
  } catch (error) {
    throw new Error("Server could not get all notifications");
  }
}