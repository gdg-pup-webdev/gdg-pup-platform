import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "@packages/typed-rest";
export const response = {
  200: z.object({ status: z.string(), message: z.string() }),
  ...SchemaFactory.Response.standardErrors(),
};
