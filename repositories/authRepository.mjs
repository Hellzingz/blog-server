import { supabase } from '../config/supabase.mjs';

// ตรวจสอบ username ซ้ำ
export async function checkUsernameExists(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username);
  
  return { data, error };
}

// สร้างผู้ใช้ใน Supabase Auth
export async function createAuthUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

// เพิ่มข้อมูลผู้ใช้ในตาราง users
export async function createUserProfile(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  return { data, error };
}

// เข้าสู่ระบบ
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// ดึงข้อมูลผู้ใช้จาก token
export async function getUserFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);
  return { data, error };
}

// ดึงข้อมูลผู้ใช้จากฐานข้อมูล
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

// ตรวจสอบรหัสผ่านเดิม
export async function verifyPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// อัปเดตรหัสผ่าน
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  return { data, error };
}

// อัปเดตโปรไฟล์ผู้ใช้
export async function updateUserProfile(userId, updateData) {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}
