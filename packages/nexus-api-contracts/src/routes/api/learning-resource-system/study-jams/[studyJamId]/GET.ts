// get a specific study jam
import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};
