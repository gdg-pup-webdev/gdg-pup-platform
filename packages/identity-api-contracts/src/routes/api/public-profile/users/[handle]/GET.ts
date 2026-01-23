import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { profile } from "#models/userSystem/index.js";

// Response Schema for Public Profile View

export const response = {
  200: SchemaFactory.Response.single(profile.publicProfileResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_description = "Get public profile by handle";
export const docs_summary = "Get public profile by handle";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
