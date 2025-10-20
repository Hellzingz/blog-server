import * as NotificationService from "../services/notification.mjs";

export const createNotification = async (req, res) => {
  try {
    const { 
      type,          
      target_type,    
      target_id,     
      recipient_id,       
      actor_id,   
      message,
      comment_text,
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น (recipient_id และ target_id เป็น optional)
    if (!type || !target_type || !actor_id || !message) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["type", "target_type", "actor_id", "message"],
        optional: ["recipient_id", "target_id"]
      });
    }

    // ตรวจสอบว่าไม่ใช่คนเดียวกัน (เฉพาะเมื่อมี recipient_id)
    if (recipient_id && recipient_id === actor_id) {
      return res.status(400).json({
        message: "Error: Cannot create notification for self"
      });
    }

    const result = await NotificationService.createNotification({
      type,
      target_type,
      target_id: target_id || null,
      recipient_id: recipient_id || null,
      actor_id,
      message,
      comment_text: comment_text || null,
    });

    res.status(201).json({
      message: "Notification created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Server could not create notification",
      error: error.message,
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all notifications", error: error.message });
  }
};

export const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await NotificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notifications", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await NotificationService.markAsRead(notificationId);
    res.json({ message: "Notification marked as read", data: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};