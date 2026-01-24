import { RequestHandler } from "express";
import { supabase } from "@/lib/supabase.js";

/**
 * parse tokens from the header instead of cookies
 * for supabaseAccessToken:
 * - Authorization: Bearer <token>
 * for googleAccessToken:
 * - x-google-access-token: <token>
 */
export const tokenParserFromHeaders: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // 1. Extract Supabase token from "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    const supabaseAccessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    // 2. Extract Google token from a custom header key
    const googleAccessToken = req.headers["x-google-access-token"] as
      | string
      | undefined;

    if (supabaseAccessToken) {
      // Get user from Supabase using the extracted token
      const { data: user, error: userError } =
        await supabase.auth.getUser(supabaseAccessToken);

      if (!userError && user) {
        req.user = user.user;
      }
    }

    // Attach tokens to the request object for later use
    req.supabaseAccessToken = supabaseAccessToken;
    req.googleAccessToken = googleAccessToken;

    return next();
  } catch (error) {
    // Fallback on error
    req.user = undefined;
    req.supabaseAccessToken = undefined;
    req.googleAccessToken = undefined;
    return next();
  }
};
