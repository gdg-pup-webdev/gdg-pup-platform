import { ProductObject } from "#models/v1/products/products.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const response = {
  200: ProductObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a product by ID";
export const docs_description = "Retrieves a single GDG product by its ID.";
