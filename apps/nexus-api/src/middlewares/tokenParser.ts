import { RequestHandler } from "express";
import { supabase } from "../lib/supabase.js";

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

/**
 * Middleware to parse authorization token from request headers.
 * If valid, attaches the user and decoded token to the request object.
 * If invalid or absent, continues without attaching user info.
 */
export const tokenParser: RequestHandler = async (req, res, next) => {
  try {
    const supabaseAccessToken = req.cookies.supabaseAccessToken as
      | string
      | undefined;
    const googleAccessToken = req.cookies.googleAccessToken as
      | string
      | undefined;

    // get user from access token
    const { data: user, error: userError } =
      await supabase.auth.getUser(supabaseAccessToken);

    req.user = user.user || undefined;
    req.supabaseAccessToken = supabaseAccessToken || undefined;
    req.googleAccessToken = googleAccessToken || undefined;

    return next();
  } catch (error) {
    // If an error occurs, mark user as undefined and continue
    req.user = undefined;
    req.supabaseAccessToken = undefined;
    req.googleAccessToken = undefined;
    return next();
  }
};
