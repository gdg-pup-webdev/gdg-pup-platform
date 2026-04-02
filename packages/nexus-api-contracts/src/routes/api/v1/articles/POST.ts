import { articleRecord, articleRecordInsertDTO } from "#models/v1/articles/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(articleRecordInsertDTO);

export const files = {
  thumbnail_image: OpenApiSchemas.Models.file(),
};

export const response = {
  201: OpenApiSchemas.Response.single(articleRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create an article";
export const docs_description = "Creates a new article record linked to a specific event and author.";
