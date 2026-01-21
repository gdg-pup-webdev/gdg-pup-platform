import { project } from "#models/userResourceSystem/index.js";
import { profile } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};
