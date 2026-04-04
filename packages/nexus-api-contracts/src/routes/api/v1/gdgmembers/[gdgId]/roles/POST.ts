import { roleRow } from "#models/v1/rbacSystem/roles.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";




export const body = OpenApiSchemas.Request.Body.withPayload(cz.object({
    roleName: cz.string(),
}))


export const response = {
    200: OpenApiSchemas.Response.boolean(),
    ...OpenApiSchemas.Response.standardErrors(),
}