 import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
        200: SchemaFactory.Response.list(role.row),
        ...SchemaFactory.Response.standardErrors(),
      }