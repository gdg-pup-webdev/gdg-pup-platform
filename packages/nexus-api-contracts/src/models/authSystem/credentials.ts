import { z } from "zod";

export const signUpRequest = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  display_name: z.string().optional(),
});

export const signInRequest = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authResponse = z.object({
  success: z.boolean(),
  user: z.any().optional(),
  session: z.any().optional(),
  message: z.string().optional(),
});
