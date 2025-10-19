import * as NotificationService from "../services/notification.mjs";

export const createNotification = async (req, res) => {
  try {
    const { 
      type,          
      target_type,    
      target_id,     
      recipient_id,       
      actor_id,       
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!type || !target_type || !target_id || !recipient_id || !actor_id ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["type", "target_type", "target_id", "recipient_id", "actor_id"]
      });
    }

    // ตรวจสอบว่าไม่ใช่คนเดียวกัน
    if (recipient_id === actor_id) {
      return res.status(400).json({
        message: "Cannot create notification for self"
      });
    }

    const result = await NotificationService.createNotification({
      type,
      target_type,
      target_id,
      recipient_id,
      actor_id,
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