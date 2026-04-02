import { logoutResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(logoutResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Logout user";
export const docs_description = "Invalidates the current session.";
