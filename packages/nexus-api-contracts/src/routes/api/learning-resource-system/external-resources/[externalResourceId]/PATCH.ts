// update the study jam 
//
 import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  externalResource.update
);

export const response = {
  200: SchemaFactory.Response.single(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};
