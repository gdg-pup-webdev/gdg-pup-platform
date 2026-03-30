import { memberProjectsRecord, memberProjectsRecordInsertDTO } from "#models/v1/memberProjects/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  mainImage: OpenApiSchemas.Models.file(),
  secondaryImage: OpenApiSchemas.Models.file(),
  tertiaryImage: OpenApiSchemas.Models.file(),
};

export const body = OpenApiSchemas.Request.Body.withPayload(memberProjectsRecordInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create a new member project";
export const docs_description = "Creates a new project for a member with optional image uploads.";
