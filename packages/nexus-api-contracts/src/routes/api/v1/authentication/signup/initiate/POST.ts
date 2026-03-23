import { initiateCreateNewUserRequest, initiateCreateNewUserResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(initiateCreateNewUserRequest);

export const response = {
  200: OpenApiSchemas.Response.single(initiateCreateNewUserResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Initiate user signup";
export const docs_description = "Initiates user signup and sends OTP to the user's email.";
