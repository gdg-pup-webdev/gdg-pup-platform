import { role } from "#models/rbacSystem/index.js";
import { user } from "#models/rbacSystem/index.js";
import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(
    z.object({
      user: user.row,
      roles: z.array(role.row),
    }),
  ),
  ...SchemaFactory.Response.standardErrors(),
};
