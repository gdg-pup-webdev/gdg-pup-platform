import { comment } from "#models/articleSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
   comment.insertDTO
);

export const response = {
  201: SchemaFactory.Response.single( comment.row),
  ...SchemaFactory.Response.standardErrors(),
};
