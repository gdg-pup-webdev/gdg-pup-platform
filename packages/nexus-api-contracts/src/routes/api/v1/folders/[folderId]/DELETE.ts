import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  folderId: cz.string().uuid(),
});

export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a folder";
export const docs_description = "Deletes a folder and all its contents recursively.";
