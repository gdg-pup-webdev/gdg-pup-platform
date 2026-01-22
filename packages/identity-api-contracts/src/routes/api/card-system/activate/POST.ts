import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

// Body Schema for POST /cards/activate
const ActivateCardBody = z.object({
  cardUid: z.string(),
  userId: z.string(),
});

export const body = SchemaFactory.Request.withPayload(ActivateCardBody);

export const response = {
  201: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};
