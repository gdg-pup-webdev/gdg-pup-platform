import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

// No body needed - cardUid from URL, userId from auth
export const body = z.object({}).optional();

export const response = {
  201: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};
