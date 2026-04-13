import {
  memberProjectsRecord,
  memberProjectsRecordUpdateDTO,
} from "#models/v1/memberProjects/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  memberProjectsRecordUpdateDTO,
);

export const response = {
  200: OpenApiSchemas.Response.single(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an existing member project";
export const docs_description =
  "Updates a member project with partial data, including an optional image URL list.";
