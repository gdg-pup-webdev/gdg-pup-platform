import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class WalletRepository {
  construtor() {}

  getWalletByUserId = async (userId: string) => {
    const { data, error } = await supabase
      .from("wallet")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.economySystem.wallet.row };
  };

  
  updateWalletBalance = async (userId: string, newBalance: number) => {
    const { data, error } = await supabase
      .from("wallet")
      .update({ balance: newBalance })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) return { error };

    return { data };
  };
}

export const walletRepositoryInstance = new WalletRepository();