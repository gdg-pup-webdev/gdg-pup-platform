import {
  DatabaseError,
  NotFoundError,
} from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

/**
 * Repository for accessing and managing transaction data in the database.
 * Handles direct interactions with the 'wallet_transaction' and 'wallet' tables.
 */
export class TransactionRepository {
  tableName = "wallet_transaction";
  walletTableName = "wallet";

  /**
   * Lists transactions for a specific user.
   * Resolves the user's wallet ID first, then fetches transactions for that wallet.
   *
   * @returns A promise resolving to a list of transactions and the total count.
   * @throws {DatabaseError} If a database error occurs during wallet lookup.
   * @throws {NotFoundError} If the user's wallet is not found.
   */
  listTransactionsByUserId = async (
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): RespositoryResultList<models.economySystem.transaction.row> => {
    const { data: walletData, error: walletError } = await supabase
      .from(this.walletTableName)
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (walletError) {
      throw new DatabaseError(walletError.message);
    }

    if (!walletData?.id) {
      throw new NotFoundError("Wallet not found.");
    }

    return await this.listTransactionsByWalletId(
      walletData.id,
      pageNumber,
      pageSize,
    );
  };

  /**
   * Lists transactions for a specific wallet.
   * Applies pagination and sorts by creation date descending.
   *
   * @returns A promise resolving to a list of transactions and the total count.
   * @throws {DatabaseError} If a database error occurs.
   */
  listTransactionsByWalletId = async (
    walletId: string,
    pageNumber: number,
    pageSize: number,
  ): RespositoryResultList<models.economySystem.transaction.row> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: listData, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to)
      .eq("wallet_id", walletId);

    if (listError) {
      throw new DatabaseError(listError.message);
    }

    const { count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("wallet_id", walletId);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      list: listData || [],
      count: count || 0,
    };
  };

  /**
   * Lists all transactions with pagination.
   * Orders by creation date descending.
   *
   * @returns A promise resolving to a paginated list of transactions and the total count.
   * @throws {DatabaseError} If a database error occurs.
   */
  listTransactions = async (
    pageNumber: number,
    pageSize: number,
  ): RespositoryResultList<models.economySystem.transaction.row> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: listData, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (listError) {
      throw new DatabaseError(listError.message);
    }

    const { count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      list: listData || [],
      count: count || 0,
    };
  };

  /**
   * Routes the list request to the appropriate method based on provided filters.
   * Precedence: userId -> walletId -> paginated list (all).
   *
   * @param filters - Object containing optional filters (userId, walletId).
   * @returns A promise resolving to a list of transactions and the total count.
   */
  listTransactionsWithFilters = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      userId?: string;
      walletId?: string;
    },
  ): RespositoryResultList<models.economySystem.transaction.row> => {
    if (filters.userId) {
      return await this.listTransactionsByUserId(
        filters.userId,
        pageNumber,
        pageSize,
      );
    }

    if (filters.walletId) {
      return await this.listTransactionsByWalletId(
        filters.walletId,
        pageNumber,
        pageSize,
      );
    }

    return await this.listTransactions(pageNumber, pageSize);
  };

  /**
   * Retrieves a single transaction by its ID.
   *
   * @returns A promise resolving to the transaction data.
   * @throws {DatabaseError} If a database error occurs.
   */
  getTransactionById = async (
    id: string,
  ): RepositoryResult<models.economySystem.transaction.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Creates a new transaction record.
   *
   * @returns A promise resolving to the created transaction data.
   * @throws {DatabaseError} If a database error occurs.
   */
  createTransaction = async (
    dto: models.economySystem.transaction.insertDTO,
  ): RepositoryResult<models.economySystem.transaction.row> => {
    // insert transaction into database
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const transactionRepositoryInstance = new TransactionRepository();
