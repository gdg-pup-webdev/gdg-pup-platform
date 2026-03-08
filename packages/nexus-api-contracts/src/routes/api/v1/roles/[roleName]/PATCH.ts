import { roleUpdateDTO, roleRow } from "#models/v1/rbacSystem/roles.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(roleUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(roleRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an existing role";

export const docs_description = "Update an existing role";
