import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY!
);

export async function signInWithGoogle() {
  const scopes = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.courses",
  ];

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Join multiple scopes with a space
      // scopes: scopes.length > 0 ? scopes.join(" ") : undefined,
      queryParams: {
        access_type: "offline", // Requests a refresh token
        prompt: "consent", // Ensures the user sees the consent screen
      },
    },
  });

  if (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }

  return data;
}
