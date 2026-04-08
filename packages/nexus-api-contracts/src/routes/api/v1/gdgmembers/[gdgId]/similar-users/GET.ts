import { gdgMemberRecord } from "#models/v1/gdgmembers/gdgMember.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { z } from "zod";

export const docs_summary = "List similar GDG members";
export const docs_description =
  "Retrieves a paginated list of public GDG members similar to the selected member. Use strategy='exploratory' to mix 80% relevant with 20% random users for discovery.";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  strategy: z.enum(["relevant", "exploratory"]).optional().default("relevant"),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(gdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
