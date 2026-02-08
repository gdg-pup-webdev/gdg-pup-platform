/**
 * @file achievement.repository.ts
 * @description Data access layer for User Achievements.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { SupabaseUtils } from "@/utils/supabase.util";

/**
 * Database types
 */
type achievementRow = Tables<"user_achievement">;
type achievementInsert = TablesInsert<"user_achievement">;
type achievementUpdate = TablesUpdate<"user_achievement">;

/**
 * AchievementRepository
 * Manages database persistence for achievements earned by users.
 */
export class AchievementRepository {
  tableName = "user_achievement";

  /**
   * listAchievementsOfUser
   * Retrieves all achievements for a specific user.
   */
  listAchievementsOfUser = async (
    userId: string,
  ): RepositoryResultList<achievementRow> => {
    return await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
      user_id: userId,
    });
  };

  /**
   * listAchievements
   * Retrieves all achievements in the system.
   */
  listAchievements = async (): RepositoryResultList<achievementRow> => {
    return await SupabaseUtils.listRows(this.tableName, 1, 1000);
  };

  /**
   * getOneAchievement
   * Fetches a single achievement by ID.
   */
  getOneAchievement = async (id: string): RepositoryResult<achievementRow> => {
    return await SupabaseUtils.getOneRow(this.tableName, id);
  };

  /**
   * createAchievement
   * Creates a new achievement record.
   */
  createAchievement = async (
    dto: achievementInsert,
  ): RepositoryResult<achievementRow> => {
    return await SupabaseUtils.createRow(this.tableName, dto);
  };

  /**
   * updateAchievement
   * Updates an existing achievement record.
   */
  updateAchievement = async (
    id: string,
    dto: achievementUpdate,
  ): RepositoryResult<achievementRow> => {
    return await SupabaseUtils.updateRow(this.tableName, id, dto);
  };

  /**
   * deleteAchievement
   * Deletes an achievement record.
   */
  deleteAchievement = async (id: string): RepositoryResult<achievementRow> => {
    return await SupabaseUtils.deleteRow(this.tableName, id);
  };
}

export const achievementRepositoryInstance = new AchievementRepository();
