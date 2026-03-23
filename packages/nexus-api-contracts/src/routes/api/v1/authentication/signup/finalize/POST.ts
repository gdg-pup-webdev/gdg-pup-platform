import { finalizeCreateNewUserRequest, finalizeCreateNewUserResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(finalizeCreateNewUserRequest);

export const response = {
  200: OpenApiSchemas.Response.single(finalizeCreateNewUserResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Finalize user signup";
export const docs_description = "Finalizes user signup by verifying the OTP.";
