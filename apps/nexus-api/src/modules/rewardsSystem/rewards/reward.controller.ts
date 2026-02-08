import { RequestHandler } from "express";
import { RewardService, rewardServiceInstance } from "./reward.service.js";
import { createExpressController } from "@packages/typed-rest";
import { contract } from "@packages/nexus-api-contracts";

export class RewardController {
  constructor(private rewardService: RewardService = rewardServiceInstance) {}

  createReward: RequestHandler = createExpressController(
    contract.api.reward_system.rewards.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const data = await this.rewardService.createReward(
        input.body.data,
        req.user!.id,
      );

      return output(200, {
        status: "success",
        message: "Reward created successfully.",
        data: data,
      });
    },
  );

  listRewards: RequestHandler = createExpressController(
    contract.api.reward_system.rewards.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const data = await this.rewardService.listRewardsByPage(
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Rewards fetched successfully.",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  getReward: RequestHandler = createExpressController(
    contract.api.reward_system.rewards.rewardId.GET,
    async ({ input, output, ctx }) => {
      const rewardId = input.params.rewardId;
      const data = await this.rewardService.getReward(rewardId);

      return output(200, {
        status: "success",
        message: "Reward fetched successfully.",
        data: data,
      });
    },
  );

  claimReward: RequestHandler = createExpressController(
    contract.api.reward_system.rewards.rewardId.claim.POST,
    async ({ input, output, ctx }) => {
      const data = await this.rewardService.claimReward(input.params.rewardId);

      return output(200, {
        status: "success",
        message: "Reward redeemed successfully.",
        data: data,
      });
    },
  );
}

export const rewardControllerInstance = new RewardController();
