import { DatabaseError, RepositoryError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts/models";


export class TransactionRepository {
  tableName = "wallet_transaction";

  constructor() {}

  listTransactionsByWalletId = async (walletId: string) => {
    const { data: listData, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("wallet_id", walletId);

    if (listError) {
      // throw new RepositoryError()
    }

    const { count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true }) // head: true means "don't return rows"
      .eq("wallet_id", walletId);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      data: {
        listData: listData as Models.economySystem.transaction.row[],
        count: (count || 0) as number,
      },
    };
  };

  createTransaction = async (
    dto: Models.economySystem.transaction.insertDTO
  ) => {
    // insert transaction into database
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) return { error };

    return { data: data as Models.economySystem.transaction.row };
  };
}

export const transactionRepositoryInstance = new TransactionRepository();
