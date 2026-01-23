/**
 * @file achievement.repository.ts
 * @description Data access layer for User Achievements. Inherits common CRUD 
 * logic from BaseRepository.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { BaseRepository } from "../common/base.repository.js";

type achievementRow = Tables<"user_achievement">;
type achievementInsert = TablesInsert<"user_achievement">;
type achievementUpdate = TablesUpdate<"user_achievement">;

/**
 * AchievementRepository
 * Manages database persistence for achievements earned by users.
 */
export class AchievementRepository extends BaseRepository<
  achievementRow,
  achievementInsert,
  achievementUpdate
> {
  constructor() {
    super("user_achievement");
  }

  /** Alias methods to maintain specific domain naming in the service layer */
  listAchievementsOfUser = this.listByUser;
  listAchievements = this.listAll;
  getOneAchievement = this.getOne;
  createAchievement = this.create;
  updateAchievement = this.update;
  deleteAchievement = this.delete;
}

export const achievementRepositoryInstance = new AchievementRepository();
