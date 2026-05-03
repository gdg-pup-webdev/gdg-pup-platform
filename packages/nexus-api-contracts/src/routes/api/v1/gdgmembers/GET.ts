import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";
import { publicGdgMemberRecord } from "#models/v1/gdgmembers/gdgMember.js";

export const docs_summary = "List GDG Members";
export const docs_description = "Retrieves a paginated list of GDG members with optional filtering.";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  search: cz.string().optional(),
  program: cz.string().optional(),
  department: cz.string().optional(),
  email: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(publicGdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
