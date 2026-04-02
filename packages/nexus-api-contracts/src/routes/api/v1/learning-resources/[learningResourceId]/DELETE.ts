import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete learning resource";
export const docs_description = [
  "Purpose: Delete a specific learning resource.",
  "Inputs: Path param learningResourceId.",
  "Outputs: Success message.",
].join("\n\n");
