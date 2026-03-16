import { GdgMerchObject, GdgMerchInsertDTO } from "#models/v1/gdgMerch/gdgMerch.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = GdgMerchInsertDTO;

export const response = {
  201: GdgMerchObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create new GDG Merch";
export const docs_description = "Creates a new item of GDG Merch";
