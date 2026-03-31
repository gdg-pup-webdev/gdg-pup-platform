import { articleRecord, articleRecordUpdateDTO } from "#models/v1/articles/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(articleRecordUpdateDTO);

export const files = {
  thumbnail_image: OpenApiSchemas.Models.file(),
};

export const response = {
  200: OpenApiSchemas.Response.single(articleRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an article";
export const docs_description = "Updates an existing article record.";
