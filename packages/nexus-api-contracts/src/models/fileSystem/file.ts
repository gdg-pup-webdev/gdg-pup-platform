import { cz as z } from "@packages/typed-rest/shared";

export const row = z.object({
  fileName: z.string().openapi({
    description: "The original name of the uploaded file.",
    example: "document.pdf",
  }),
  fileDescription: z.string().openapi({
    description: "A short description or caption for the file.",
    example: "Event floor plan for DevFest 2026",
  }),
  filePath: z.string().openapi({
    description: "The internal path or key used to locate the file in storage.",
  }),

  // metadata
  id: z.string().openapi({
    description: "The unique identifier for the file record.",
  }),
  createdAt: z.string().openapi({
    description: "The timestamp when the file record was created.",
  }),
  updatedAt: z.string().openapi({
    description: "The timestamp when the file record was last updated.",
  }),
  deletedAt: z.string().openapi({
    description: "The timestamp when the file record was soft-deleted.",
  }),

  // access data
  storageReference: z.string().openapi({
    description: "The storage provider's reference or bucket identifier.",
  }),
  previewUrl: z.string().openapi({
    description: "A URL used to preview the file content (e.g., a thumbnail or low-res version).",
  }),
  downloadUrl: z.string().openapi({
    description: "A direct or signed URL to download the original file.",
  }),
});

export const insertDTO = row.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  storageReference: true,
  previewUrl: true,
  downloadUrl: true,
});

export const updateDTO = insertDTO.partial();
