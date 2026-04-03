import { GdgMerchObject, GdgMerchUpdateDTO } from "#models/v1/gdgMerch/gdgMerch.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const body = GdgMerchUpdateDTO;

export const response = {
  200: GdgMerchObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update GDG Merch details";
export const docs_description = "Updates the information details of a GDG merch item. Does not update stock.";
