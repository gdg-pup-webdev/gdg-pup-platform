import { userRow } from "#models/v1/userSystem/user.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = cz.object({
  q: cz.string(),
  limit: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.list(userRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Search users by text";
export const docs_description = "Search users by matching text against display name, email, first name, and last name.";
