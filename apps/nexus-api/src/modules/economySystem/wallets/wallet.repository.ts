import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

/**
 * Repository for accessing and managing wallet data in the database.
 * Handles direct interactions with the 'wallet' table.
 */
export class WalletRepository {
  tableName = "wallet";

  /**
   * Retrieves a wallet associated with a specific user ID.
   *
   * @returns A promise resolving to the wallet data.
   * @throws {DatabaseError} If a database error occurs.
   */
  listWalletsOfUser = async (
    userId: string,
  ): RepositoryResult<models.economySystem.wallet.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  list = async (): RepositoryResultList<models.economySystem.wallet.row> => {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };

  /**
   * Updates the balance of a user's wallet.
   *
   * @returns A promise resolving to the updated wallet data.
   * @throws {DatabaseError} If a database error occurs.
   */
  updateWalletBalance = async (
    userId: string,
    newBalance: number,
  ): RepositoryResult<models.economySystem.wallet.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ balance: newBalance })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const walletRepositoryInstance = new WalletRepository();
