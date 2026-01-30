import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = z.object({
  roleIds: z.array(z.string()),
});

export const response = {
  200: SchemaFactory.Response.single(z.boolean()),
  ...SchemaFactory.Response.standardErrors(),
};
