import { finalizeChangeEmailRequest, finalizeChangeEmailResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(finalizeChangeEmailRequest);

export const response = {
  200: OpenApiSchemas.Response.single(finalizeChangeEmailResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Finalize email change";
export const docs_description = "Finalizes changing the user's email by verifying the OTP.";
