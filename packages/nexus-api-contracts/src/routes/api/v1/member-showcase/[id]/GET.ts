import { memberShowcaseRecord } from "#models/v1/memberShowcase/memberShowcase.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(memberShowcaseRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get member showcase";
export const docs_description = "Returns a single member showcase by ID.";
