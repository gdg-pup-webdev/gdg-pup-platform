import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const response = {
  200: z.object({ status: z.string(), message: z.string() }),
  ...SchemaFactory.Response.standardErrors(),
};
