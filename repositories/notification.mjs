import { supabase } from "../config/supabase.mjs";

export async function createNotification(notificationData) {
  const { type, target_type, target_id, recipient_id, actor_id, message } = notificationData;
  
  const { data, error } = await supabase
    .from("notifications")
    .insert([{
      type,
      target_type,
      target_id: target_id || null, // null ถ้าไม่มี target_id
      recipient_id: recipient_id || null, // null = broadcast notification
      actor_id,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getNotifications(userId) {
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
    .or(`recipient_id.eq."${userId}",recipient_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function markAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select();

  if (error) throw error;
  return data[0];
}