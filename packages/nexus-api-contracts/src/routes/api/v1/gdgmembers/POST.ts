import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { gdgMemberRecord, gdgMemberRecordInsertDTO } from "#models/v1/gdgmembers/gdgMember.js";

export const docs_summary = "Add a new GDG Member";
export const docs_description = "Creates a new record for a GDG member.";

export const body = OpenApiSchemas.Request.Body.withPayload(gdgMemberRecordInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(gdgMemberRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
