import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";
export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.paginated(role.row),
  ...SchemaFactory.Response.standardErrors(),
};
