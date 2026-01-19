import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

export class WalletRepository {
  tableName = "wallet";

  construtor() {}

  getWalletByUserId = async (
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
