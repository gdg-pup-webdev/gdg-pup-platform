import { file } from "#models/fileSystem/index.js";
import { models } from "#typedrest.contract.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const responses = {
  200: OpenApiSchemas.Response.paginated(file.row),
  ...OpenApiSchemas.Response.standardErrors(),
};
