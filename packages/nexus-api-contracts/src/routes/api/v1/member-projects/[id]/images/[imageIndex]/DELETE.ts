import { memberProjectsRecord } from "#models/v1/memberProjects/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a member project image by index";
export const docs_description =
  "Deletes an image at the given index and compacts the remaining image order.";
