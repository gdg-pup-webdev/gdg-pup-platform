import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(certificate.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};
