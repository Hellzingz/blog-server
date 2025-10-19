import { supabase } from '../config/supabase.mjs';

// CHECK Username Exists
export async function checkUsernameExists(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username);
  
  return { data, error };
}

// CREATE Auth User
export async function createAuthUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

// CREATE User Profile
export async function createUserProfile(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  return { data, error };
}

// SIGN IN
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// GET User from Token
export async function getUserFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);
  return { data, error };
}

// GET User by ID
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

// VERIFY Password
export async function verifyPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// UPDATE Password
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  return { data, error };
}

// UPDATE User Profile
export async function updateUserProfile(userId, updateData) {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}
