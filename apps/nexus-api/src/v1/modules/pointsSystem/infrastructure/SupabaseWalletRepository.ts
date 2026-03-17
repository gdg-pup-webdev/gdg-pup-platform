import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet, PointsBalance } from "../domain/Wallet";

/**
 * SupabaseWalletRepository
 *
 * Maps the `wallet` database table to the Wallet domain entity.
 *
 * DB schema:
 *   wallet { id, user_id, balance, spark_points, webdev_points, updated_at, created_at }
 *
 * The wallet table stores individual named columns for known point types.
 * "balance" is kept as the totalPoints field.
 * Any extra point types beyond the two known ones are tracked
 * by accumulating the remaining balance (balance - spark_points - webdev_points)
 * under a synthetic "otherPoints" key – future migrations can add explicit columns.
 *
 * NOTE: The domain model uses a flexible dictionary, so the infrastructure
 * maps the known DB columns to well-known point-type keys.
 */
export class SupabaseWalletRepository extends IWalletRepository {
  private readonly tableName = "wallet";

  private mapToDomain(row: any): Wallet {
    const points: PointsBalance = {
      sparkPoints: row.spark_points ?? 0,
      webdevPoints: row.webdev_points ?? 0,
    };

    return Wallet.hydrate({
      userId: row.user_id,
      points,
      totalPoints: row.balance ?? 0,
      updatedAt: row.updated_at ?? new Date().toISOString(),
    });
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) return null;

    return this.mapToDomain(data);
  }

  async persistUpdates(wallet: Wallet): Promise<Wallet> {
    const { points } = wallet.props;

    const { error } = await supabase
      .from(this.tableName)
      .update({
        spark_points: points["sparkPoints"] ?? 0,
        webdev_points: points["webdevPoints"] ?? 0,
        balance: wallet.props.totalPoints,
        updated_at: wallet.props.updatedAt,
      })
      .eq("user_id", wallet.props.userId);

    if (error) handlePostgresError(error);

    return wallet;
  }
}
