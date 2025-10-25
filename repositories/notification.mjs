import { supabase } from "../config/supabase.mjs";

// CREATE Notification
export async function createNotification(notificationData) {
  const {
    type,
    target_type,
    target_id,
    recipient_id,
    actor_id,
    message,
    comment_text,
  } = notificationData;

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        type,
        target_type,
        target_id: target_id || null,
        recipient_id: recipient_id || null,
        actor_id,
        message,
        comment_text: comment_text || null,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

// GET Notifications by User ID
export async function getNotificationsByUserId({page, limit}, userId) {
  try {
    const truePage = Math.max(1, page);
    const truelimit = Math.max(1, Math.min(100, limit));
    const offset = (truePage - 1) * truelimit;

    const { data, count, error } = await supabase
      .from("notifications")
      .select(
        `
          *,
          actor:actor_id (
            id,
            username,
            name,
            profile_pic
          )
        `
      )
      .eq("recipient_id", userId)
      .range(offset, offset + truelimit - 1)
      .order("created_at", { ascending: false })
      .count("exact");

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    const totalPages = Math.ceil(count / truelimit);
    return { data, totalPages, currentPage: truePage };
  } catch (error) {
    console.error('Repository error:', error);
    throw error;
  }
}

// MARK Notification as Read
export async function markAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select();

  if (error) throw error;
  return data[0];
}
