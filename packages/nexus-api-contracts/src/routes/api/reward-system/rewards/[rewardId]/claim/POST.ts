import { transaction, wallet } from "#models/economySystem/index.js";
import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "@packages/typed-rest";
export const response = {
  200: SchemaFactory.Response.single(reward.claimResponse),
  ...SchemaFactory.Response.standardErrors(),
};
