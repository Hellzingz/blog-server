import * as NotificationRepository from "../repositories/notification.mjs";

// CREATE Notification
export async function createNotification(notificationData) {
  try {
    // Call Repository
    const result = await NotificationRepository.createNotification(notificationData);
    return result;
  } catch (error) {
    throw new Error("Server could not create notification");
  }
}

// GET Notifications by User ID
export async function getNotifications(userId) {
  try {
    // Call Repository
    const result = await NotificationRepository.getNotifications(userId);
    return result;
  } catch (error) {
    throw new Error("Server could not get notifications");
  }
}

// MARK Notification as Read
export async function markAsRead(notificationId) {
  try {
    // Call Repository
    const result = await NotificationRepository.markAsRead(notificationId);
    return result;
  } catch (error) {
    throw new Error("Server could not mark notification as read");
  }
}

// GET All Notifications
export async function getAllNotifications() {
  try {
    // Call Repository
    const result = await NotificationRepository.getAllNotifications();
    return result;
  } catch (error) {
    throw new Error("Server could not get all notifications");
  }
}