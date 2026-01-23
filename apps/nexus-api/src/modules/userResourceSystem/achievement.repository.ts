import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type achievementRow = Tables<"user_achievement">;
type achievementInsert = TablesInsert<"user_achievement">;
type achievementUpdate = TablesUpdate<"user_achievement">;

export class AchievementRepository {
  tableName = "user_achievement";

  constructor() {}

  listAchievementsOfUser = async (
    userId: string,
  ): RespositoryResultList<achievementRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  listAchievements = async (): RespositoryResultList<achievementRow> => {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });
    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  getOneAchievement = async (id: string): RepositoryResult<achievementRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  createAchievement = async (
    dto: achievementInsert,
  ): RepositoryResult<achievementRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  deleteAchievement = async (id: string): RepositoryResult<achievementRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };

  updateAchievement = async (
    id: string,
    dto: achievementUpdate,
  ): RepositoryResult<achievementRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);
    return data;
  };
}

export const achievementRepositoryInstance = new AchievementRepository();
