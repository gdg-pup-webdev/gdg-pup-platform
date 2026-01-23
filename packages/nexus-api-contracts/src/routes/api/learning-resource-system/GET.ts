// list learning resources

import { learningResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(learningResource.shape),
  ...SchemaFactory.Response.standardErrors(),
};
