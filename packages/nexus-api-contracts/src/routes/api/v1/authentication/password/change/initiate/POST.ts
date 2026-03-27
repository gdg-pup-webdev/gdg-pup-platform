import { initiateChangePasswordRequest, initiateChangePasswordResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(initiateChangePasswordRequest);

export const response = {
  200: OpenApiSchemas.Response.single(initiateChangePasswordResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Initiate password change";
export const docs_description = "Initiates changing the user's password and sends an OTP.";
