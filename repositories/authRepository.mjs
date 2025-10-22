import { supabase } from "../config/supabase.mjs";

// CHECK Email Exists - Simple approach: let signUp handle it
export async function checkEmailExists(email) {
  return { data: null, error: null };
}

// CHECK Username Exists - Database operation
export async function checkUsernameExists(username) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  return { data, error };
}

// CREATE Auth User - Supabase Auth operation
export async function createAuthUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

// CREATE User Profile - Database operation
export async function createUserProfile(userData) {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  return { data, error };
}

// SIGN IN - Supabase Auth operation
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// GET User from Token - Supabase Auth operation
export async function getUserFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);
  return { data, error };
}

// GET User by ID - Database operation
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

// VERIFY Password - Supabase Auth operation
export async function verifyPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// UPDATE Password - Supabase Auth operation
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

// UPDATE User Profile - Database operation
export async function updateUserProfile(userId, updateData) {
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}
