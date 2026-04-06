import {
  ProductObject,
  ProductUpdateDTO,
} from "#models/v1/products/products.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const body = ProductUpdateDTO;

export const response = {
  200: ProductObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update a product";
export const docs_description = "Update a GDG product by ID.";
