  
import { supabase } from "@/v1/lib/supabase.js";
import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import {
  TransactionRecord,
  TransactionRecordPrototype,
  TransactionRecordProps,
} from "../domain/TransactionRecord.js";
import { handlePostgresError } from "@/v1/lib/supabase.utils.js";

export class TransactionRepository extends ITransactionRepository {
  private readonly tableName = "wallet_transaction" as const;

  async findById(id: string): Promise<TransactionRecord | null> {
    const { data, error } = await supabase
      .from("wallet_transaction")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) return null;

    return TransactionRecord.hydrate(this.mapToProps(data));
  }

  async listByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // 1. Get Paginated Data
    const { data, error: listError } = await supabase
      .from("wallet_transaction")
      .select("*")
      .eq("user_id", userId) // Filtering by userId directly
      .order("created_at", { ascending: false })
      .range(from, to);

    if (listError) handlePostgresError(listError);

    // 2. Get Total Count
    const { count, error: countError } = await supabase
      .from("wallet_transaction")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) handlePostgresError(countError);

    return {
      list: (data || []).map(
        (row) => TransactionRecord.hydrate(this.mapToProps(row)),
      ),
      count: count || 0,
    };
  }

  async savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord> {
    const entries = prototype.props.entries;
    let lastTransaction: TransactionRecord | null = null;

    for (const entry of entries) {
      const { data, error } = await supabase
        .from("wallet_transaction")
        .insert({
          user_id: prototype.props.userId,
          amount: entry.amount,
          point_type: entry.pointType,
          source_id: prototype.props.sourceReference ?? "N/A",
          source_type: prototype.props.sourceType ?? "system",
        })
        .select("*")
        .single();

      if (error) handlePostgresError(error);
      lastTransaction = TransactionRecord.hydrate(this.mapToProps(data));
    }

    if (!lastTransaction) {
      throw new Error("No entries to save for transaction");
    }

    return lastTransaction;
  }

  /**
   * Helper to map Snake Case (Postgres) to Camel Case (Domain Props)
   */
  private mapToProps(data: any): TransactionRecordProps {
    return {
      id: data.id,
      createdAt: data.created_at,
      userId: data.user_id,
      entries: [
        {
          pointType: data.point_type,
          amount: data.amount,
        },
      ],
      sourceReference: data.source_id,
      sourceType: data.source_type,
    };
  }
}
