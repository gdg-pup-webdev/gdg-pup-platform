import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz } from "@packages/typed-rest/shared";

/**
 * DOCUMENTATIONS
 */
export const docs_summary = "Get the roles of the user.";
export const docs_description = "Get the roles of the user."; 

/**
 * SCHEMAS
 */ 
export const response = {
  200: OpenApiSchemas.Response.list(
    cz.object({
      id: cz.string(),
      name: cz.string(),
      description: cz.string(),
    }),
  ),
  ...OpenApiSchemas.Response.standardErrors(),
};
 