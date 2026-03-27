import { memberShowcaseRecord } from "#models/v1/memberShowcase/memberShowcase.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(memberShowcaseRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get spotlight showcase";
export const docs_description = "Returns the spotlight member showcase of the day.";
