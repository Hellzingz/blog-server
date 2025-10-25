import * as NotificationRepository from "../repositories/notification.mjs";

// CREATE Notification
export async function createNotification(notificationData) {
  try {
    const result = await NotificationRepository.createNotification(
      notificationData
    );
    return result;
  } catch (error) {
    throw new Error("Server could not create notification");
  }
}

// GET Notifications by User ID
export async function getNotificationsByUserId(options, userId) {
  try {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const result = await NotificationRepository.getNotificationsByUserId(
      { page, limit },
      userId
    );
    return {
      success: true,
      data: {
        notifications: result.data,
        totalPages: result.totalPages,
        currentPage: result.currentPage
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// MARK Notification as Read
export async function markAsRead(notificationId) {
  try {
    const result = await NotificationRepository.markAsRead(notificationId);
    return result;
  } catch (error) {
    throw new Error("Server could not mark notification as read");
  }
}
