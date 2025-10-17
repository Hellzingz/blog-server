import { supabase } from '../config/supabase.mjs';

export class CategoriesRepository {
  // ดึงหมวดหมู่ทั้งหมด
  static async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    
    return { data, error };
  }

  // ดึงหมวดหมู่ตาม ID
  static async getCategoryById(categoryId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    return { data, error };
  }

  // ตรวจสอบชื่อหมวดหมู่ซ้ำ
  static async checkCategoryNameExists(name) {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single();
    
    return { data, error };
  }

  // ตรวจสอบชื่อหมวดหมู่ซ้ำ (ยกเว้น ID ที่ระบุ)
  static async checkCategoryNameExistsExcludingId(name, excludeId) {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .neq('id', excludeId)
      .single();
    
    return { data, error };
  }

  // สร้างหมวดหมู่ใหม่
  static async createCategory(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name }])
      .select()
      .single();
    
    return { data, error };
  }

  // อัปเดตหมวดหมู่
  static async updateCategory(categoryId, name) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name: name })
      .eq('id', categoryId)
      .select()
      .single();
    
    return { data, error };
  }

  // ลบหมวดหมู่
  static async deleteCategory(categoryId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    
    return { error };
  }
}
