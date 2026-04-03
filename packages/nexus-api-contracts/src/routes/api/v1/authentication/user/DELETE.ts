import { deleteUserRequest, deleteUserResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(deleteUserRequest);

export const response = {
  200: OpenApiSchemas.Response.single(deleteUserResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete user";
export const docs_description = "Deletes the user's account.";
