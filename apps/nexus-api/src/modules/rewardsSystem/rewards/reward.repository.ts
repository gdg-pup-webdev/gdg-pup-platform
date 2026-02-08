import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert } from "@/types/supabase.types.js";

type rewardRow = Tables<"reward">;
type rewardInsert = TablesInsert<"reward">;

/**
 * Repository for managing rewards in the database.
 */
export class RewardRepository {
  private readonly tableName = "reward";

  /**
   * Lists all rewards with pagination.
   * @returns A list of rewards and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  async list(
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<rewardRow> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get rewards from the database
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  }

  /**
   * Creates a new reward.
   * @returns The created reward.
   * @throws {DatabaseError} If the database operation fails.
   */
  async createReward(dto: rewardInsert): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  }

  /**
   * Gets a single reward by its ID.
   * @param id - The ID of the reward to fetch.
   * @returns The fetched reward.
   * @throws {DatabaseError} If the database operation fails.
   */
  async getRewardById(id: string): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  }

  /**
   * Marks a reward as claimed.
   * @returns The updated reward.
   * @throws {DatabaseError} If the database operation fails.
   */
  async markRewardAsClaimed(reward_id: string): RepositoryResult<rewardRow> {
    const { data, error } = await supabase
      .from(this.tableName)
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
