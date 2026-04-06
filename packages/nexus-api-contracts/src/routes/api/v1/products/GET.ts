import { ProductObject } from "#models/v1/products/products.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(ProductObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List all products";
export const docs_description = "List all GDG products. Supports pagination.";
