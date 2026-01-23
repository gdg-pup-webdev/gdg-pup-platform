import { card } from "#models/cardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(card.row),
  ...SchemaFactory.Response.standardErrors(),
};
