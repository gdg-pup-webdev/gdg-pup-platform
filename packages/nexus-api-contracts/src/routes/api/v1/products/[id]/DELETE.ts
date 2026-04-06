import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const response = {
  200: cz.object({ success: cz.boolean() }),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a product";
export const docs_description = "Delete a GDG product by ID.";
