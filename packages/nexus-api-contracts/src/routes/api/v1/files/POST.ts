import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    fileName: cz.string(),
    fileDescription: cz.string(),
  }),
);

export const files = {
  file: OpenApiSchemas.Models.file,
};

export const responses = {
  200: OpenApiSchemas.Response.single(
    cz.object({
      fileName: cz.string(),
      fileDescription: cz.string(),

      // metadata
      id: cz.string(),
      createdAt: cz.string(),
      updatedAt: cz.string(),
      deletedAt: cz.string(),

      // access data
      storageReference: cz.string(),
      previewUrl: cz.string(),
      downloadUrl: cz.string(),
    }),
  ),
};

export const docs_summary = "Upload a single file to the server";
