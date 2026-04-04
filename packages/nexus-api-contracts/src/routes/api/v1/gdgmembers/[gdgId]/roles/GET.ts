import { roleRow } from "#models/v1/rbacSystem/roles.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";


export const query = OpenApiSchemas.Request.Query.paginated();

export const response=  {
    200: OpenApiSchemas.Response.paginated(roleRow), 
    ...OpenApiSchemas.Response.standardErrors(),
}