import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  permissionIds: z.array(z.string()),
});

export const response = {
  200: SchemaFactory.Response.single(z.boolean()),
  ...SchemaFactory.Response.standardErrors(),
};
