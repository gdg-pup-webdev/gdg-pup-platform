import { GdgMerchObject } from "#models/v1/gdgMerch/gdgMerch.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(GdgMerchObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List all GDG Merch";
export const docs_description = "List all GDG Merch. Supports pagination.";
