import { verifyTokenRequest, verifyTokenResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(verifyTokenRequest);

export const response = {
  200: OpenApiSchemas.Response.single(verifyTokenResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Verify authentication token";
export const docs_description = "Verifies the provided JWT token.";
