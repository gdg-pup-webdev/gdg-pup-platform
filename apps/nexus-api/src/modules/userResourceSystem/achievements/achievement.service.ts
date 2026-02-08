/**
 * @file achievement.service.ts
 * @description Business logic layer for User Achievements. Handles data 
 * orchestration and error mapping between the controller and repository.
 */

import {
  AchievementRepository,
  achievementRepositoryInstance,
} from "./achievement.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type achievementInsertDTO = models.userResourceSystem.achievement.insertDTO;
type achievementUpdateDTO = models.userResourceSystem.achievement.updateDTO;

export class AchievementService {
  constructor(
    private readonly achievementRepository: AchievementRepository = achievementRepositoryInstance,
  ) {}

  /**
   * listAchievementsOfUser
   * Retrieves all achievements for a specific user.
   */
  listAchievementsOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.listAchievementsOfUser(userId),
      "listing achievements",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * listAchievements
   * Retrieves all achievements across all users.
   */
  listAchievements = async () => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.listAchievements(),
      "listing achievements",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * getOneAchievement
   * Retrieves a single achievement by its ID.
   */
  getOneAchievement = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.getOneAchievement(id),
      "getting achievement",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * createAchievement
   * Validates and persists a new achievement for a user.
   * @param dto - Data containing title, description, image URL, and user_id.
   */
  createAchievement = async (dto: achievementInsertDTO) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.achievementRepository.createAchievement(dto),
      "creating achievement",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * deleteAchievement
   * Removes an achievement record.
   */
  deleteAchievement = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.deleteAchievement(id),
      "deleting achievement",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * updateAchievement
   * Updates an existing achievement's metadata.
   */
  updateAchievement = async (id: string, dto: achievementUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.achievementRepository.updateAchievement(id, dto),
      "updating achievement",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };
}

export const achievementServiceInstance = new AchievementService();
