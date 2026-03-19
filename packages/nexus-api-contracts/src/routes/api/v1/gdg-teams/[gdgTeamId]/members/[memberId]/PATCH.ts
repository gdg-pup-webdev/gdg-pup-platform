import { teamMember, teamMemberUpdateDTO } from "#models/v1/teamSystem/member.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(teamMemberUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(teamMember),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update team member position";
export const docs_description = "Update the position/role of a team member.";
