import {
  ProductObject,
  ProductInsertDTO,
} from "#models/v1/products/products.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = cz.object({
  data: ProductInsertDTO,
});

export const response = {
  201: ProductObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create a new product";
export const docs_description = "Create a new GDG product.";
