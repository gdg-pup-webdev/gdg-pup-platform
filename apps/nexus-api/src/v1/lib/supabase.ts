import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase.types";
import { configs } from "@/configs/configs";

const supabaseUrl = configs.supabase.supabaseUrl;
const supabaseKey = configs.supabase.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Secret Key in environment variables.");
}

/**
 * Global client for system-level database operations.
 * Initialized with the service role key to bypass RLS.
 * CRITICAL: This instance should NEVER be used for auth.setSession or user-specific auth calls.
 * It is intended for shared, read-only or system-level write operations.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/**
 * A dedicated service role client specifically for admin auth operations.
 * Use this in services that perform sign-ups, sign-ins, or user management.
 * We create a separate instance just to be absolutely sure no state is shared.
 */
export const serviceRoleClient = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/**
 * Factory to create a fresh client per request or operation.
 * Prevents cross-request session bleeding in the backend.
 * Each call returns a BRAND NEW client instance.
 */
export const createAuthClient = () => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
