import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { Models } from "#models/index.js";

// Response Schema for Public Profile View
const PublicProfileResponse = z.object({
  user: Models.userSystem.UserModels.row,
  profile: Models.userSystem.UserProfileModels.row.nullable(),
});

export const response = {
  200: SchemaFactory.Response.single(PublicProfileResponse),
  ...SchemaFactory.Response.standardErrors(),
};
