import { ProfileAnalyticsRecord } from "#models/v1/analytics/profileView.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  gdgId: cz.string(),
});

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  days: cz.coerce.number().optional().default(7),
});

export const response = {
  200: OpenApiSchemas.Response.single(ProfileAnalyticsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get profile view analytics";
export const docs_description =
  "Returns view analytics and a list of views for a specific member profile.";
