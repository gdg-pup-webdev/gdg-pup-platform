import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    fromIndex: cz.number().int().min(0),
    toIndex: cz.number().int().min(0),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Reorder member projects";
export const docs_description =
  "Reorders a member project's list based on source and destination indices.";
