 import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  project.insertDTO
);

export const response = {
  201: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};
