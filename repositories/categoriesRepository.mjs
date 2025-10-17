import { supabase } from '../config/supabase.mjs';

// ดึงหมวดหมู่ทั้งหมด
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });
  
  return { data, error };
}

// ดึงหมวดหมู่ตาม ID
export async function getCategoryById(categoryId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();
  
  return { data, error };
}

// ตรวจสอบชื่อหมวดหมู่ซ้ำ
export async function checkCategoryNameExists(name) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .single();
  
  return { data, error };
}

// ตรวจสอบชื่อหมวดหมู่ซ้ำ (ยกเว้น ID ที่ระบุ)
export async function checkCategoryNameExistsExcludingId(name, excludeId) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .neq('id', excludeId)
    .single();
  
  return { data, error };
}

// สร้างหมวดหมู่ใหม่
export async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name }])
    .select()
    .single();
  
  return { data, error };
}

// อัปเดตหมวดหมู่
export async function updateCategory(categoryId, name) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name })
    .eq('id', categoryId)
    .select()
    .single();
  
  return { data, error };
}

// ลบหมวดหมู่
export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  
  return { error };
}
