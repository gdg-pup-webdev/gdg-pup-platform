import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase.types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

// Global client for database operations
export const supabase = createClient<Database>(supabaseUrl!, supabaseKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Factory to create a fresh client per auth operation
// Prevents cross-request session bleeding in the backend
export const createAuthClient = () => {
  return createClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
