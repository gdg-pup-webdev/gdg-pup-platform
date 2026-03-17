import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(cz.object({ success: cz.boolean() })),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a team resource";
export const docs_description = "Removes a team resource from the system by ID.";
