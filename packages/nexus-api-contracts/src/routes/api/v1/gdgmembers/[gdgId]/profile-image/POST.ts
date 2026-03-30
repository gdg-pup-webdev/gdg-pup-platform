import { gdgMemberRecord } from "#models/v1/gdgmembers/gdgMember.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
    newProfile: OpenApiSchemas.Models.file()
}

export const response = {
    200: OpenApiSchemas.Response.single(gdgMemberRecord),
    ...OpenApiSchemas.Response.standardErrors(),
}