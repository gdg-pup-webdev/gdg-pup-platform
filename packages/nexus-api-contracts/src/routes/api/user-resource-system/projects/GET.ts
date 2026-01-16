import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.list(Models.userResourceSystem.project.row),
  ...SchemaFactory.Response.standardErrors(),
};
