import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  roleId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Remove a permission from a role";

export const docs_description =
  "Remove a specific permission from a role. The permission must belong to the specified role. This does not delete the permission itself, only the association.";

export const docs_params = {
  permissionId: "UUID of the permission to remove",
};

export const docs_body = {
  roleId: "UUID of the role to remove this permission from (required)",
};

export const docs_response_200 = "Successfully removed permission from role";

export const docs_response_404 =
  "Not found - Permission does not exist or does not belong to specified role";

export const docs_response_500 =
  "Internal server error - Failed to remove permission";
