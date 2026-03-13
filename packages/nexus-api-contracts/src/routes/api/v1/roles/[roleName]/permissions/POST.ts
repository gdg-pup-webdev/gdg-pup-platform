import {
  rolePermission,
  rolePermissionInsertDTO,
} from "#models/v1/rbacSystem/roles.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  rolePermissionInsertDTO,
);

export const response = {
  200: OpenApiSchemas.Response.single(rolePermission),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Add permission to a role";

export const docs_description = "Add permission to a role";
