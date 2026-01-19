import { wallet } from "#models/economySystem/index.js";
 import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
        200: SchemaFactory.Response.single(wallet.row),
        ...SchemaFactory.Response.standardErrors(),
      }