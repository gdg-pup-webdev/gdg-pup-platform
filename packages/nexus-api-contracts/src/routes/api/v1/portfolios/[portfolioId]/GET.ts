import { portfolioRow } from "#models/v1/portfolioSystem/portfolio.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(portfolioRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a portfolio by ID";
export const docs_description = [
  "Purpose: Retrieve a single member portfolio by its database ID.",
  "Inputs: URL param portfolioId.",
  "Outputs: Single portfolio record.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
export const docs_response_200 = "Successfully retrieved portfolio.";
export const docs_response_404 = "Portfolio not found for the provided ID.";
