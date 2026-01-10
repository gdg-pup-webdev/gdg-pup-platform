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
}

export const walletRepositoryInstance = new WalletRepository();