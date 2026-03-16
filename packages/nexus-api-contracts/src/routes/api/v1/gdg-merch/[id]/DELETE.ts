import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  id: cz.string(),
});

export const response = {
  200: cz.object({ success: cz.boolean() }),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete GDG Merch";
export const docs_description = "Deletes a piece of GDG Merch by ID";
