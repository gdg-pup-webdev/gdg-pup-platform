import { memberProjectsRecord } from "#models/v1/memberProjects/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
 

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List projects by member GDG ID";
export const docs_description = "Returns a paginated list of projects associated with a specific member.";
