import { DatabaseError } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type rewardRow = Tables<"reward">;
type rewardInsert = TablesInsert<"reward">;
type rewardUpdate = TablesUpdate<"reward">;

export class RewardRepository {
  tableName = "reward";

  constructor() {}

  async list(
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<rewardRow> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get rewards from the database
    const { data, error } = await supabase
      .from("reward")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from("reward")
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  }

  async createReward(dto: rewardInsert): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from("reward")
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  }

  async getRewardById(id: string): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from("reward")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  }

  async markRewardAsClaimed(reward_id: string): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from("reward")
      .update({
        is_claimed: true,
      })
      .eq("id", reward_id)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  }
}

export const rewardRepositoryInstance = new RewardRepository();
