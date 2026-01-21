 import { articleComment } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
   articleComment.insertDTO
);

export const response = {
  201: SchemaFactory.Response.single( articleComment.row),
  ...SchemaFactory.Response.standardErrors(),
};
