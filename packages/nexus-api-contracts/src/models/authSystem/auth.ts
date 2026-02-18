import { z } from "zod";

export const verifyEmailRequest = z.object({
  token_hash: z.string().min(1),
  type: z.enum([
    "signup",
    "magiclink",
    "recovery",
    "invite",
    "email_change",
    "email",
  ]),
});

export const verificationResponse = z.object({
  success: z.boolean(),
  user: z.any(),
  session: z.any(),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequest>;
export type VerificationResponse = z.infer<typeof verificationResponse>;
