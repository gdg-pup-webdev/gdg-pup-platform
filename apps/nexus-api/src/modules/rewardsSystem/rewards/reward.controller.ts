import { RequestHandler } from "express";
import { RewardService, rewardServiceInstance } from "./reward.service.js";
import { createExpressController } from "@packages/typed-rest";
import { contract, models } from "@packages/nexus-api-contracts";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { ServiceError_DEPRECATED } from "@/classes/ServerError.js";

export class RewardController {
  constructor(private rewardService: RewardService = rewardServiceInstance) {}

  createReward: RequestHandler = createExpressController(
    contract.api.reward_system.rewards.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const { data, error } = await tryCatch(
        async () =>
          await this.rewardService.createReward(input.body.data, req.user!.id),
        "creating reward",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

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
      const { data, error } = await tryCatch(
        async () =>
          await this.rewardService.listRewardsByPage(
            pageNumber,
            pageSize,
          ),
        "listing rewards",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.rewardService.getReward(rewardId),
        "getting reward",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.rewardService.claimReward(input.params.rewardId),
        "claiming reward",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Reward redeemed successfully.",
        data: data,
      });
    },
  );
}

export const rewardControllerInstance = new RewardController();
