import { gdgTeam } from "#models/v1/teamSystem/team.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = cz.object({
  q: cz.string(),
  limit: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.list(gdgTeam),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Search GDG teams by text";
export const docs_description = "Search GDG teams by matching text against name and description.";
