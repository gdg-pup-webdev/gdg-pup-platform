import {
  RewardRepository,
  rewardRepositoryInstance,
} from "./reward.repository.js";
import { ConflictError, NotFoundError } from "@/errors/HttpError.js";
import { models } from "@packages/nexus-api-contracts";
import {
  WalletService,
  walletServiceInstance,
} from "@/modules/economySystem/wallets/wallet.service.js";

type rewardInsertDTO = models.rewardSystem.reward.insert;
type rewardUpdateDTO = models.rewardSystem.reward.update;

export class RewardService {
  constructor(
    private readonly rewardRepository: RewardRepository = rewardRepositoryInstance,
    private readonly walletService: WalletService = walletServiceInstance,
  ) {}

  listRewardsByPage = async (pageNumber: number, pageSize: number) => {
    return await this.rewardRepository.list(pageNumber, pageSize);
  };

  createReward = async (body: rewardInsertDTO, creator_id: string) => {
    return await this.rewardRepository.createReward(body);
  };

  getReward = async (id: string) => {
    return await this.rewardRepository.getRewardById(id);
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
    const reward = await this.rewardRepository.getRewardById(reward_id);

    // check if reward is claimable
    if (reward.is_claimed) throw new ConflictError("Reward already claimed");

    // mark reward as claimed
    const markRewardAsClaimedData =
      await this.rewardRepository.markRewardAsClaimed(reward_id);

    // debit user's wallet
    const walletData = await this.walletService.incrementPoints(
      reward.user_id,
      reward.value,
      "reward",
      reward_id,
    );

    // return data
    return {
      updatedReward: markRewardAsClaimedData,
      updatedUserWallet: walletData.updatedWallet,
      transaction: walletData.transaction,
    };
  };
}

export const rewardServiceInstance = new RewardService();
