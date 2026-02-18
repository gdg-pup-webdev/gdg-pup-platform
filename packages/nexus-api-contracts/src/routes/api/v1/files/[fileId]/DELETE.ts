import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const responses = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "delete file";
