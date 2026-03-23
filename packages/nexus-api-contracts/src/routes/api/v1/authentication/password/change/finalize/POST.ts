import { finalizeChangePasswordRequest, finalizeChangePasswordResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(finalizeChangePasswordRequest);

export const response = {
  200: OpenApiSchemas.Response.single(finalizeChangePasswordResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Finalize password change";
export const docs_description = "Finalizes changing the user's password by verifying the OTP.";
