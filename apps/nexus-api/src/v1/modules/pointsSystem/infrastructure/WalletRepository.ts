  
import { supabase } from "@/v1/lib/supabase";
import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet } from "../domain/Wallet";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

export class WalletRepository extends IWalletRepository {
  private readonly tableName = "wallet";

  async findByUserId(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) return null;

    // Mapping legacy schema to Domain Model
    return Wallet.hydrate({
      userId: data.user_id,
      totalPoints: data.balance, // Mapping legacy 'balance' to 'totalPoints'
      updatedAt: data.updated_at || new Date().toISOString(),
      points: {
        sparkPoints: data.spark_points || 0, // Assuming these exist or default to 0
        webdevPoints: data.webdev_points || 0,
      },
    });
  }

  async persistUpdates(wallet: Wallet): Promise<Wallet> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        balance: wallet.props.totalPoints,
        spark_points: wallet.props.points.sparkPoints,
        webdev_points: wallet.props.points.webdevPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", wallet.props.userId)
      .select("*")
      .single();

    if (error) handlePostgresError(error);
    
    return wallet;
  }
}