import { supabase } from "../config/supabase.mjs";

export async function createNotification(notificationData) {
  const { type, target_type, target_id, recipient_id, actor_id } = notificationData;
  
  const { data, error } = await supabase
    .from("notifications")
    .insert([{
      type,
      target_type,
      target_id,
      recipient_id,
      actor_id,
      is_read: false,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getNotifications(recipient_id) {
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
    .eq("recipient_id", recipient_id)
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