import { cz as z } from "@packages/typed-rest/shared";

export const signUpRequest = z.object({
  email: z.string().email().openapi({
    description: "The email address to register the new account.",
    example: "dev@gdgpup.org",
  }),
  password: z.string().min(6).openapi({
    description: "The password for the new account. Must be at least 6 characters.",
    example: "securePassword123",
  }),
  display_name: z.string().optional().openapi({
    description: "The name that will be displayed for the user profile.",
    example: "Juan Dela Cruz",
  }),
});

export const signInRequest = z.object({
  email: z.string().email().openapi({
    description: "The email address of the account.",
    example: "dev@gdgpup.org",
  }),
  password: z.string().openapi({
    description: "The password associated with the account.",
    example: "securePassword123",
  }),
});

export const authResponse = z.object({
  success: z.boolean().openapi({
    description: "Indicates if the authentication operation was successful.",
  }),
  user: z.any().optional().openapi({
    description: "The authenticated user object containing basic profile information.",
  }),
  session: z.any().optional().openapi({
    description: "The authentication session details including access and refresh tokens.",
  }),
  message: z.string().optional().openapi({
    description: "A descriptive message about the operation result, often used for error details.",
  }),
});
