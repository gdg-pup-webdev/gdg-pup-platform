import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class TransactionRepository {
  constructor() {}

  listTransactionsByWalletId = async (walletId: string) => {
    const { data: listData, error: listError } = await supabase
      .from("wallet_transaction")
      .select("*")
      .eq("wallet_id", walletId);
    if (listError) {
      return { error: listError };
    }

    const { count, error } = await supabase
      .from("wallet_transaction")
      .select("*", { count: "exact", head: true }) // head: true means "don't return rows"
      .eq("wallet_id", walletId);
    if (error) {
      return { error };
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
      .from("wallet_transaction")
      .insert(dto)
      .select("*")
      .single();

    if (error) return { error };

    return { data: data as Models.economySystem.transaction.row };
  };
}

export const transactionRepositoryInstance = new TransactionRepository();
