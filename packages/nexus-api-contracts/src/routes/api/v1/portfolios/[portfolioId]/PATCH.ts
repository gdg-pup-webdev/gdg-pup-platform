import {
  portfolioUpdateDTO,
  portfolioRow,
} from "#models/v1/portfolioSystem/portfolio.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(portfolioUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(portfolioRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update a portfolio property";
export const docs_description = [
  "Purpose: Update one or more properties of a member portfolio.",
  "Only the provided fields will be updated; all fields are optional.",
  "Inputs: URL param portfolioId, body: partial portfolio update payload.",
  "Outputs: Updated portfolio record.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
export const docs_response_200 = "Successfully updated portfolio.";
export const docs_response_404 = "Portfolio not found for the provided ID.";
