/**
 * @file achievement.repository.ts
 * @description Data access layer for User Achievements.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { SupabaseWrapper } from "../common/supabase.wrapper.js";

type achievementRow = Tables<"user_achievement">;
type achievementInsert = TablesInsert<"user_achievement">;
type achievementUpdate = TablesUpdate<"user_achievement">;

/**
 * AchievementRepository
 * Manages database persistence for achievements earned by users.
 */
export class AchievementRepository {
  private readonly db = new SupabaseWrapper<
    achievementRow,
    achievementInsert,
    achievementUpdate
  >("user_achievement");

  /**
   * listAchievementsOfUser
   * Retrieves all achievements for a specific user.
   */
  listAchievementsOfUser = (userId: string) => this.db.listByUser(userId);

  /**
   * listAchievements
   * Retrieves all achievements in the system.
   */
  listAchievements = () => this.db.listAll();

  /**
   * getOneAchievement
   * Fetches a single achievement by ID.
   */
  getOneAchievement = (id: string) => this.db.getOne(id);

  /**
   * createAchievement
   * Creates a new achievement record.
   */
  createAchievement = (dto: achievementInsert) => this.db.create(dto);

  /**
   * updateAchievement
   * Updates an existing achievement record.
   */
  updateAchievement = (id: string, dto: achievementUpdate) =>
    this.db.update(id, dto);

  /**
   * deleteAchievement
   * Deletes an achievement record.
   */
  deleteAchievement = (id: string) => this.db.delete(id);
}

export const achievementRepositoryInstance = new AchievementRepository();