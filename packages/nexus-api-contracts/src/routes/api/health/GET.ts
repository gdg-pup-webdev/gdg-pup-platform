import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";
export const response = {
  200: z.object({ status: z.string(), message: z.string() }),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List resource";
export const docs_description = [
  "Purpose: List resource.",
  "Inputs: None.",
  "Outputs: See response schema.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
