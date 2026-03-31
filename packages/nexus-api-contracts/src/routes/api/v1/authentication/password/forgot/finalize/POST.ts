import { finalizeForgotPasswordRequest, finalizeForgotPasswordResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(finalizeForgotPasswordRequest);

export const response = {
  200: OpenApiSchemas.Response.single(finalizeForgotPasswordResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Finalize forgot password";
export const docs_description = "Finalizes the forgot password process by verifying the OTP and setting a new password.";
