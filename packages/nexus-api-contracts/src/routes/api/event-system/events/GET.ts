import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  creator_id: z.string().optional(),
  category: z.string().optional(),
  venue: z.string().optional(),
  start_date_gte: z.string().optional(),
  start_date_lte: z.string().optional(),
  end_date_gte: z.string().optional(),
  end_date_lte: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(event.row),
  ...SchemaFactory.Response.standardErrors(),
};
