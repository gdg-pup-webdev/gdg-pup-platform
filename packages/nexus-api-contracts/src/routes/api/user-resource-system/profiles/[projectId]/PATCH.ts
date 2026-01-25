import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(project.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};
