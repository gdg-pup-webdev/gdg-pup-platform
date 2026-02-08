/**
 * @file achievement.service.ts
 * @description Business logic layer for User Achievements. Handles data
 * orchestration and error mapping between the controller and repository.
 */

import {
  AchievementRepository,
  achievementRepositoryInstance,
} from "./achievement.repository.js";
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
    return await this.achievementRepository.listAchievementsOfUser(userId);
  };

  /**
   * listAchievements
   * Retrieves all achievements across all users.
   */
  listAchievements = async () => {
    return await this.achievementRepository.listAchievements();
  };

  /**
   * getOneAchievement
   * Retrieves a single achievement by its ID.
   */
  getOneAchievement = async (id: string) => {
    return await this.achievementRepository.getOneAchievement(id);
  };

  /**
   * createAchievement
   * Validates and persists a new achievement for a user.
   * @param dto - Data containing title, description, image URL, and user_id.
   */
  createAchievement = async (dto: achievementInsertDTO) => {
    return await this.achievementRepository.createAchievement(dto);
  };

  /**
   * deleteAchievement
   * Removes an achievement record.
   */
  deleteAchievement = async (id: string) => {
    return await this.achievementRepository.deleteAchievement(id);
  };

  /**
   * updateAchievement
   * Updates an existing achievement's metadata.
   */
  updateAchievement = async (id: string, dto: achievementUpdateDTO) => {
    return await this.achievementRepository.updateAchievement(id, dto);
  };
}

export const achievementServiceInstance = new AchievementService();
