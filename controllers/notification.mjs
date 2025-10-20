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
      recipient_id: recipient_id || null, // null = broadcast notification
      actor_id,
      message,
    });

    res.status(201).json({
      message: recipient_id ? "Notification created successfully" : "Broadcast notification created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Server could not create notification",
      error: error.message,
    });
  }
};

export const getBroadcastNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getBroadcastNotifications();
    
    res.status(200).json({
      message: "Broadcast notifications retrieved successfully",
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Server could not get broadcast notifications",
      error: error.message,
    });
  }
};
