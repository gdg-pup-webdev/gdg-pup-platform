import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(certificate.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};