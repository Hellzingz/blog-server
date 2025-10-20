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

export async function getNotifications(recipient_id) {
  console.log('Getting notifications for recipient_id:', recipient_id);
  
  try {
    // ดึง personal notifications
    const { data: personalNotifications, error: personalError } = await supabase
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

    if (personalError) {
      console.error('Personal notifications error:', personalError);
      throw personalError;
    }

    // ดึง broadcast notifications
    const { data: broadcastNotifications, error: broadcastError } = await supabase
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
      .is("recipient_id", null)
      .order("created_at", { ascending: false });

    if (broadcastError) {
      console.error('Broadcast notifications error:', broadcastError);
      throw broadcastError;
    }

    // รวม notifications และเรียงลำดับตาม created_at
    const allNotifications = [...(personalNotifications || []), ...(broadcastNotifications || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log('Notifications retrieved:', allNotifications.length);
    return allNotifications;
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
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


export async function getBroadcastNotifications() {
  console.log('Getting broadcast notifications');
  
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
    .is("recipient_id", null) // ดึงเฉพาะ broadcast notifications
    .order("created_at", { ascending: false });

  if (error) {
    console.error('Broadcast notifications error:', error);
    throw error;
  }
  
  console.log('Broadcast notifications retrieved:', data?.length || 0);
  return data;
}

// ฟังก์ชันทดสอบการเชื่อมต่อ database
export async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("count")
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database test error:', error);
    return false;
  }
}