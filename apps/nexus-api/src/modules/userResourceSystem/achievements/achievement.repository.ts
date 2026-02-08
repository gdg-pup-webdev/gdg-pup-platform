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
import { DatabaseError } from "@/errors/HttpError";
import { tryCatch } from "@/utils/tryCatch.util";
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
    const { data, error } = await tryCatch(
      async () =>
        await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
          user_id: userId,
        }),
      "Calling database to list achievements of user",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * listAchievements
   * Retrieves all achievements in the system.
   */
  listAchievements = async (): RepositoryResultList<achievementRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.listRows(this.tableName, 1, 1000),
      "Calling database to list achievements",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * getOneAchievement
   * Fetches a single achievement by ID.
   */
  getOneAchievement = async (id: string): RepositoryResult<achievementRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.getOneRow(this.tableName, id),
      "Calling database to get one achievement",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * createAchievement
   * Creates a new achievement record.
   */
  createAchievement = async (
    dto: achievementInsert,
  ): RepositoryResult<achievementRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.createRow(this.tableName, dto),
      "Calling database to create achievement",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * updateAchievement
   * Updates an existing achievement record.
   */
  updateAchievement = async (
    id: string,
    dto: achievementUpdate,
  ): RepositoryResult<achievementRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.updateRow(this.tableName, id, dto),
      "Calling database to update achievement",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * deleteAchievement
   * Deletes an achievement record.
   */
  deleteAchievement = async (id: string): RepositoryResult<achievementRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.deleteRow(this.tableName, id),
      "Calling database to delete achievement",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const achievementRepositoryInstance = new AchievementRepository();
