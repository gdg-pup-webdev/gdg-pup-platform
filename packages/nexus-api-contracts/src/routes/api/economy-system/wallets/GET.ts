import { wallet } from "#models/economySystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "@packages/typed-rest";
export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(wallet.row),
  ...SchemaFactory.Response.standardErrors(),
};
