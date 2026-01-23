import {
  AchievementRepository,
  achievementRepositoryInstance,
} from "./achievement.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type achievementInsertDTO = models.userResourceSystem.achievement.insertDTO;
type achievementUpdateDTO = models.userResourceSystem.achievement.updateDTO;

export class AchievementService {
  constructor(
    private achievementRepository: AchievementRepository = achievementRepositoryInstance,
  ) {}

  listAchievementsOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.listAchievementsOfUser(userId),
      "listing achievements",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listAchievements = async () => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.listAchievements(),
      "listing achievements",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  getOneAchievement = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.getOneAchievement(id),
      "getting achievement",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createAchievement = async (dto: achievementInsertDTO, userId: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.achievementRepository.createAchievement({
          ...dto,
          user_id: userId,
        }),
      "creating achievement",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteAchievement = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.deleteAchievement(id),
      "deleting achievement",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  updateAchievement = async (id: string, dto: achievementUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.updateAchievement(id, dto),
      "updating achievement",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const achievementServiceInstance = new AchievementService();
