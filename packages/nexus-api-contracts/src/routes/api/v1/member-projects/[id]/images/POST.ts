import { memberProjectsRecord } from "#models/v1/memberProjects/record.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  image: OpenApiSchemas.Models.file(),
};

export const body = cz.object({})

export const response = {
  200: OpenApiSchemas.Response.single(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Add an image to a member project";
export const docs_description =
  "Uploads a new image and appends it to the project's image list. The list supports up to 4 images.";
