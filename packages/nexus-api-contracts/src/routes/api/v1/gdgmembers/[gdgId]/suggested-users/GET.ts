import { suggestedGdgMemberRecord } from "#models/v1/gdgmembers/suggestedGdgMember.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const docs_summary = "List suggested GDG members";
export const docs_description =
  "Retrieves a paginated list of suggested public GDG members for discovery, including broader cross-domain recommendations.";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(suggestedGdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
