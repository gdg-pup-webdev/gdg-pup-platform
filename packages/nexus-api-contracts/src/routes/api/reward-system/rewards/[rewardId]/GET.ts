import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";


 
export const response = { 
    200: SchemaFactory.Response.single(reward.row),
    ...SchemaFactory.Response.standardErrors(),
}