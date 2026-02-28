import { supabase } from "@/v0/lib/supabase.js";
import { handlePostgresError } from "@/v0/lib/supabase.utils";
import { ITransactionRepository } from "../domain/ITransactionRepository";
import {
  TransactionRecord,
  TransactionRecordPrototype,
  TransactionRecordProps,
} from "../domain/TransactionRecord";

// Concrete implementation of the abstract TransactionRecord
class PersistentTransactionRecord extends TransactionRecord {}

export class TransactionRepository extends ITransactionRepository {
  private readonly tableName = "wallet_transaction";

  async findById(id: string): Promise<TransactionRecord | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) return null;

    return new PersistentTransactionRecord(this.mapToProps(data));
  }

  async listUserTransactions(
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // 1. Get Paginated Data
    const { data, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId) // Filtering by userId directly
      .order("created_at", { ascending: false })
      .range(from, to);

    if (listError) handlePostgresError(listError);

    // 2. Get Total Count
    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) handlePostgresError(countError);

    return {
      list: (data || []).map(
        (row) => new PersistentTransactionRecord(this.mapToProps(row)),
      ),
      count: count || 0,
    };
  }

  async savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        user_id: prototype.props.userId,
        points_change: prototype.props.pointsChange,
        points_type: prototype.props.pointsType,
        source_reference: prototype.props.sourceReference,
        source_type: prototype.props.sourceType,
      })
      .select("*")
      .single();

    if (error) handlePostgresError(error);

    return new PersistentTransactionRecord(this.mapToProps(data));
  }

  /**
   * Helper to map Snake Case (Postgres) to Camel Case (Domain Props)
   */
  private mapToProps(data: any): TransactionRecordProps {
    return {
      id: data.id,
      createdAt: data.created_at,
      userId: data.user_id,
      pointsChange: data.points_change,
      pointsType: data.points_type,
      sourceReference: data.source_reference,
      sourceType: data.source_type,
    };
  }
}
