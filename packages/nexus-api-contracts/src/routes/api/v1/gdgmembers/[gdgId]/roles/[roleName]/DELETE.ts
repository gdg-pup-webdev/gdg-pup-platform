import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
    200: OpenApiSchemas.Response.empty(), 
    ...OpenApiSchemas.Response.standardErrors(),
}