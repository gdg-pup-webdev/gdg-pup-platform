import { DatabaseError, RepositoryError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

export class TransactionRepository {
  tableName = "wallet_transaction";

  constructor() {}

  listTransactionsByWalletId = async (
    walletId: string,
  ): RepositoryResultList<models.economySystem.transaction.row> => {
    const { data: listData, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
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

  listTransactions = async (
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<models.economySystem.transaction.row> => {
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
