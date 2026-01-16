import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
        200: SchemaFactory.Response.single(Models.economySystem.wallet.row),
        ...SchemaFactory.Response.standardErrors(),
      }