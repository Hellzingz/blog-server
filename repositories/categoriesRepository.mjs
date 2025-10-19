import { supabase } from '../config/supabase.mjs';

// GET All Categories
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });
  
  return { data, error };
}

// GET Category by ID
export async function getCategoryById(categoryId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();
  
  return { data, error };
}

// CHECK Category Name Exists
export async function checkCategoryNameExists(name) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .single();
  
  return { data, error };
}

// CHECK Category Name Exists Excluding ID
export async function checkCategoryNameExistsExcludingId(name, excludeId) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .neq('id', excludeId)
    .single();
  
  return { data, error };
}

// CREATE Category
export async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name }])
    .select()
    .single();
  
  return { data, error };
}

// UPDATE Category
export async function updateCategory(categoryId, name) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name })
    .eq('id', categoryId)
    .select()
    .single();
  
  return { data, error };
}

// DELETE Category
export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  
  return { error };
}
