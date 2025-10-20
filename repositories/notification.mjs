import { supabase } from "../config/supabase.mjs";

// CREATE Notification - Database operation
export async function createNotification(notificationData) {
  const { type, target_type, target_id, recipient_id, actor_id, message, comment_text } =
    notificationData;

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        type,
        target_type,
        target_id: target_id || null, // null if no target_id
        recipient_id: recipient_id || null, // null = broadcast notification
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

// GET Notifications by User ID - Database operation with joins
export async function getNotifications(userId) {
  const { data, error } = await supabase
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
    .or(`recipient_id.eq.${userId},recipient_id.is.null`)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// MARK Notification as Read - Database operation
export async function markAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select();

  if (error) throw error;
  return data[0];
}

// GET All Notifications - Database operation with joins
export async function getAllNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select(`
      *,
      actor:actor_id (
        id,
        username,
        name,
        profile_pic
      )
    `)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
