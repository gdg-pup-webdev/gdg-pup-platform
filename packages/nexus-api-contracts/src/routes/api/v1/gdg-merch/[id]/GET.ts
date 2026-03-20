import { GdgMerchObject } from "#models/v1/gdgMerch/gdgMerch.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const response = {
  200: GdgMerchObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get specific GDG Merch";
export const docs_description = "Retrieve details for a specific piece of GDG Merch by ID";
