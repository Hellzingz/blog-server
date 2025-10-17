import { supabase } from '../config/supabase.mjs';

export class AuthRepository {
  // ตรวจสอบ username ซ้ำ
  static async checkUsernameExists(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);
    
    return { data, error };
  }

  // สร้างผู้ใช้ใน Supabase Auth
  static async createAuthUser(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { data, error };
  }

  // เพิ่มข้อมูลผู้ใช้ในตาราง users
  static async createUserProfile(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    return { data, error };
  }

  // เข้าสู่ระบบ
  static async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  }

  // ดึงข้อมูลผู้ใช้จาก token
  static async getUserFromToken(token) {
    const { data, error } = await supabase.auth.getUser(token);
    return { data, error };
  }

  // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
  static async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }

  // ตรวจสอบรหัสผ่านเดิม
  static async verifyPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  }

  // อัปเดตรหัสผ่าน
  static async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    return { data, error };
  }

  // อัปเดตโปรไฟล์ผู้ใช้
  static async updateUserProfile(userId, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  }
}
