import { permission, role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const description = "List the permissions of a role";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get permission";
export const docs_description = [
  "Purpose: Get permission.",
  "Inputs: Path params: see schema. Query params: see schema.",
  "Outputs: Paginated list of permissions with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
