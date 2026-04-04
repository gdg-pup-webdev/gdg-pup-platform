import { roleRow } from "#models/v1/rbacSystem/roles.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(roleRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get role by name";

export const docs_description ="Get role by name";