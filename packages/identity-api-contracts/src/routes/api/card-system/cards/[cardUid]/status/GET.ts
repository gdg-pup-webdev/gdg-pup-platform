import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { Models } from "#models/index.js";

// Response Schema for GET /cards/:cardUid/status
const CardStatusResponse = z.object({
  card: Models.cardSystem.CardModels.row,
  user: Models.userSystem.UserModels.row.nullable(),
});

export const response = {
  200: SchemaFactory.Response.single(CardStatusResponse),
  ...SchemaFactory.Response.standardErrors(),
};
