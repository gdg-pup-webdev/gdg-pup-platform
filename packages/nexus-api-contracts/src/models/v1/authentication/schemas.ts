import {cz as z} from "@packages/typed-rest/shared";

export const initiateCreateNewUserRequest = z.object({
  email: z.string().email(),
  pass: z.string().min(8),
});

export const initiateCreateNewUserResponse = z.object({
  referenceCode: z.string(),
});

export const finalizeCreateNewUserRequest = z.object({
  referenceCode: z.string(),
  otp: z.string(),
});

export const finalizeCreateNewUserResponse = z.object({
  success: z.boolean(),
});

export const loginRequest = z.object({
  email: z.string().email(),
  pass: z.string(),
});

export const loginResponse = z.object({
  token: z.string(),
});

export const verifyTokenRequest = z.object({
  token: z.string(),
});

export const verifyTokenResponse = z.boolean();

export const initiateChangePasswordRequest = z.object({
  email: z.string().email(),
  pass: z.string(),
  newPass: z.string().min(8),
});

export const initiateChangePasswordResponse = z.object({
  referenceCode: z.string(),
});

export const finalizeChangePasswordRequest = z.object({
  referenceCode: z.string(),
  otp: z.string(),
});

export const finalizeChangePasswordResponse = z.object({
  success: z.boolean(),
});

export const initiateForgotPasswordRequest = z.object({
  email: z.string().email(),
});

export const initiateForgotPasswordResponse = z.object({
  referenceCode: z.string(),
});

export const finalizeForgotPasswordRequest = z.object({
  referenceCode: z.string(),
  otp: z.string(),
  newPass: z.string().min(8),
});

export const finalizeForgotPasswordResponse = z.object({
  success: z.boolean(),
});

export const initiateChangeEmailRequest = z.object({
  email: z.string().email().optional(), // Adjust based on token or body
  pass: z.string(),
  newEmail: z.string().email(),
});

export const initiateChangeEmailResponse = z.object({
  referenceCode: z.string(),
});

export const finalizeChangeEmailRequest = z.object({
  referenceCode: z.string(),
  otp: z.string(),
});

export const finalizeChangeEmailResponse = z.object({
  success: z.boolean(),
});

export const resendOtpRequest = z.object({
  referenceCode: z.string(),
});

export const resendOtpResponse = z.object({
  success: z.boolean(),
});

export const deleteUserRequest = z.object({
  email: z.string().email().optional(), // Might come from token
  pass: z.string().optional(),
});

export const deleteUserResponse = z.object({
  success: z.boolean(),
});

export const meResponse = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string(),
  gdg_id: z.string().nullable(),
});

export const logoutResponse = z.object({
  success: z.boolean(),
});

