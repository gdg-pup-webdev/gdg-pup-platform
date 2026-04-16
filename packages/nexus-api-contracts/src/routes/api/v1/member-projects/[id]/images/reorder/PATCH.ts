import { memberProjectsRecord } from "#models/v1/memberProjects/record.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    fromIndex: cz.number().int().nonnegative(),
    toIndex: cz.number().int().nonnegative(),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.single(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Reorder member project images";
export const docs_description =
  "Moves an image from fromIndex to toIndex within the project's image list.";
