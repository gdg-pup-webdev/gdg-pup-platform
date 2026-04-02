import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { gdgMemberRecord } from "#models/v1/gdgmembers/gdgMember.js";

export const docs_summary = "Find GDG Member by ID";
export const docs_description = "Retrieves a specific GDG member by their GDG ID.";

export const response = {
  200: OpenApiSchemas.Response.single(gdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
