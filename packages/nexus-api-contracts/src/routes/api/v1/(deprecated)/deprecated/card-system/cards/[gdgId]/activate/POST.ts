import { sparkmatesCardActivateResponse } from "#models/v1/portfolioSystem/sparkmates.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(sparkmatesCardActivateResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Activate card by GDG ID";
export const docs_description = [
  "Purpose: Activate a Sparkmates card and make the linked portfolio publicly visible.",
  "Inputs: URL param gdgId.",
  "Outputs: Activated state and visibility flag.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
