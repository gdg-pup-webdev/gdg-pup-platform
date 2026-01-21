import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  WalletService,
  walletServiceInstance,
} from "../economySystem/wallet.service.js";
import {
  RewardRepository,
  rewardRepositoryInstance,
} from "./reward.repository.js";
import { generateCouponCode } from "./reward.utils.js";
import {
  InvalidOperationError,
  NotFoundError,
  RepositoryError,
} from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type rewardInsertDTO = models.rewardSystem.reward.insert;
type rewardUpdateDTO = models.rewardSystem.reward.update;

export class RewardService {
  constructor(
    private rewardRepository: RewardRepository = rewardRepositoryInstance,
    private walletService: WalletService = walletServiceInstance,
  ) {}

  listRewardsByPage = async (pageNumber: number, pageSize: number) => {
    const { data, error } = await tryCatch(
      async () => await this.rewardRepository.list(pageNumber, pageSize),
      "listing rewards",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createReward = async (body: rewardInsertDTO, creator_id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.rewardRepository.createReward(body),
      "creating reward",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  getReward = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.rewardRepository.getRewardById(id),
      "fetching reward",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  /**
   * Claims a reward
   * process:
   * - get reward data
   * - check if reward is claimable
   * - mark reward as claimed
   * - debit user's wallet -> records transaction as sideeffect
   * - return claimed reward
   */
  claimReward = async (reward_id: string) => {
    // get data of reward to be claimed
    const { data: reward, error: rewardError } = await tryCatch(
      async () => await this.rewardRepository.getRewardById(reward_id),
      "fetching reward",
    );
    if (rewardError) throw new RepositoryError(rewardError.message);
    if (!reward) throw new NotFoundError("Reward not found");

    // check if reward is claimable
    if (reward.is_claimed)
      throw new InvalidOperationError("Reward already claimed");

    // mark reward as claimed
    const {
      data: markRewardAsClaimedData,
      error: markRewardAsClaimedDataError,
    } = await tryCatch(
      async () => await this.rewardRepository.markRewardAsClaimed(reward_id),
      "marking reward as claimed",
    );
    if (markRewardAsClaimedDataError)
      throw new RepositoryError(markRewardAsClaimedDataError.message);

    // debit user's wallet
    const { data: walletData, error: walletError } = await tryCatch(
      async () =>
        await this.walletService.incrementPoints(
          reward.user_id,
          reward.value,
          "reward",
          reward_id,
        ),
      "incrementing points of user",
    );
    if (walletError) throw new RepositoryError(walletError.message);
    if (!walletData) throw new NotFoundError("Wallet not found");

    // return data
    return {
      updatedReward: markRewardAsClaimedData,
      updatedUserWallet: walletData.updatedWallet,
      transaction: walletData.transaction,
    };
  };
}

export const rewardServiceInstance = new RewardService();
