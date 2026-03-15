import { sparkmatesCardStatusResponse } from "#models/v1/portfolioSystem/sparkmates.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(sparkmatesCardStatusResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get card status by GDG ID";
export const docs_description = [
  "Purpose: Check current card lifecycle status for a GDG ID.",
  "Inputs: URL param gdgId.",
  "Outputs: issued/activated/suspended/revoked and visibility flag.",
  "Errors: 400, 404, 500.",
  "Auth: Public.",
].join("\n\n");
