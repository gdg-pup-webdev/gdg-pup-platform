import { GdgMerchObject, GdgMerchRestockDTO } from "#models/v1/gdgMerch/gdgMerch.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const body = GdgMerchRestockDTO;

export const response = {
  200: GdgMerchObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Restock GDG Merch";
export const docs_description = "Adds to the stock count of the given merch item.";
