import { GdgMerchObject, GdgMerchRedeemDTO } from "#models/v1/gdgMerch/gdgMerch.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const body = GdgMerchRedeemDTO;

export const response = {
  200: GdgMerchObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Redeem GDG Merch";
export const docs_description = "Consumes points of a given user to redeem this merch. Reduces stock by 1.";
