import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(achievement.row), // Controller uses metadata, so response should be paginated
  ...SchemaFactory.Response.standardErrors(),
};
