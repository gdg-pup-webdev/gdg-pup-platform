import { transaction, wallet } from "#models/economySystem/index.js";
import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.single(reward.claimResponse),
  ...SchemaFactory.Response.standardErrors(),
};
