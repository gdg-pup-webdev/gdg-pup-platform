import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  permissionIds: z.array(z.string()),
  roleId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Bulk remove multiple permissions from a role";

export const docs_description =
  "Remove multiple permissions from a role in a single transaction. All specified permissions must belong to the given role. This is more efficient than making multiple individual requests.";

export const docs_body = {
  roleId: "UUID of the role to remove permissions from (required)",
  permissionIds: [
    "UUID of first permission to remove",
    "UUID of second permission to remove",
    "... additional permission UUIDs",
  ],
};

export const docs_response_200 =
  "Successfully removed all specified permissions from role";

export const docs_response_404 =
  "Not found - One or more permissions do not exist or do not belong to specified role";

export const docs_response_500 =
  "Internal server error - Failed to remove permissions";
