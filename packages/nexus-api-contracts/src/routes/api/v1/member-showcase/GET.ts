import { memberShowcaseRecord } from "#models/v1/memberShowcase/memberShowcase.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(memberShowcaseRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List member showcases";
export const docs_description = "Returns a paginated list of member showcases.";
