import { initiateChangeEmailRequest, initiateChangeEmailResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(initiateChangeEmailRequest);

export const response = {
  200: OpenApiSchemas.Response.single(initiateChangeEmailResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Initiate email change";
export const docs_description = "Initiates changing the user's email and sends an OTP.";
