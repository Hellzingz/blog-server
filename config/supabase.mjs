import { createClient } from "@supabase/supabase-js";

// ตรวจสอบ environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Error: Supabase environment variables are not set');
  process.exit(1);
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      accessTokenExpiresIn: 7200,
      accessTokenExpiry: 86400,  // 1 วัน
    }
  }
);
