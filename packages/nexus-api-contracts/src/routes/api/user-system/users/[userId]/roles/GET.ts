import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
        200: SchemaFactory.Response.list(Models.roleSystem.role.row),
        ...SchemaFactory.Response.standardErrors(),
      }