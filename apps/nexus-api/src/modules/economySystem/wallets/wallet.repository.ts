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

  /**
   * Lists wallets based on provided filters.
   * If userId is provided, returns that user's wallet as a list.
   * Otherwise, returns all wallets.
   *
   * @param filters - Object containing optional userId filter.
   * @returns A promise resolving to a list of wallets and the total count.
   */
  listWalletsWithFilters = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      userId?: string | null;
    },
  ): RepositoryResultList<models.economySystem.wallet.row> => {
    if (filters.userId) {
      const wallet = await this.listWalletsOfUser(filters.userId);

      return {
        list: wallet ? [wallet] : [],
        count: wallet ? 1 : 0,
      };
    }

    return await this.list(pageNumber, pageSize);
  };

  /**
   * Lists all wallets in the database.
   * Applies pagination and sorts by creation date descending.
   *
   * @returns A promise resolving to a list of all wallets and the total count.
   * @throws {DatabaseError} If a database error occurs.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<models.economySystem.wallet.row> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

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
