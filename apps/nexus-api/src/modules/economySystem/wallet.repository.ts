import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

export class WalletRepository {
  tableName = "wallet";

  construtor() {}

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

  list = async (): RespositoryResultList<models.economySystem.wallet.row> => {
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
