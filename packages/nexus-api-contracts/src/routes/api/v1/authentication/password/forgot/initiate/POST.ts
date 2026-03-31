import { initiateForgotPasswordRequest, initiateForgotPasswordResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(initiateForgotPasswordRequest);

export const response = {
  200: OpenApiSchemas.Response.single(initiateForgotPasswordResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Initiate forgot password";
export const docs_description = "Initiates the forgot password process and sends an OTP to the user's email.";
