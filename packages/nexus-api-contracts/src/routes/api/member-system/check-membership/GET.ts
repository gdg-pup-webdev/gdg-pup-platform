import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = z.object({
  email: z.string().email(),
});

export const response = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      isMember: z.boolean(),
      member: z.any().nullable(),
    }),
  }),
  ...SchemaFactory.Response.standardErrors(),
};
