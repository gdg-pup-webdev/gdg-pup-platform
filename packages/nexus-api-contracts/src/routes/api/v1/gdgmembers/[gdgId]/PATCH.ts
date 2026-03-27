import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { gdgMemberRecord, gdgMemberRecordUpdateDTO } from "#models/v1/gdgmembers/gdgMember.js";

export const docs_summary = "Update GDG Member";
export const docs_description = "Updates an existing GDG member's information.";

export const body = OpenApiSchemas.Request.Body.withPayload(gdgMemberRecordUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(gdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
