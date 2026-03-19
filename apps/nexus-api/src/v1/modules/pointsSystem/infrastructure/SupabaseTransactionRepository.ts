import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import {
  PointEntry,
  TransactionRecord,
  TransactionRecordProps,
  TransactionRecordPrototype,
} from "../domain/TransactionRecord.js";

/**
 * SupabaseTransactionRepository
 *
 * Maps the `wallet_transaction` table to TransactionRecord domain objects.
 *
 * DB schema (one row per point-type change):
 *   wallet_transaction { id, user_id, amount, point_type, source_id, source_type, created_at }
 *
 * Strategy:
 *   - A single logical TransactionRecord is spread across one or more DB rows
 *     sharing the same `source_id` (the transaction group ID).
 *   - `source_id` is generated as a UUID and stored in the prototype; it serves
 *     as the domain-level transaction ID.
 *   - `source_type` is set to "points_system_transaction".
 *
 * When listing transactions, rows are grouped by source_id to rebuild
 * the TransactionRecord with its entries array.
 */
export class SupabaseTransactionRepository extends ITransactionRepository {
  private readonly tableName = "wallet_transaction";
  private readonly sourceType = "points_system_transaction";

  /** Reconstruct a TransactionRecord from a group of DB rows with the same source_id */
  private groupToRecord(rows: any[]): TransactionRecord {
    const first = rows[0];
    const entries: PointEntry[] = rows.map((r) => ({
      pointType: r.point_type ?? "unknown",
      amount: r.amount ?? 0,
    }));
    const props: TransactionRecordProps = {
      id: first.source_id,
      userId: first.user_id,
      createdAt: first.created_at,
      entries,
    };
    return TransactionRecord.hydrate(props);
  }

  async findById(id: string): Promise<TransactionRecord | null> {
    // id here is the source_id (transaction group ID)
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("source_id", id);

    if (error) handlePostgresError(error);
    if (!data || data.length === 0) return null;

    return this.groupToRecord(data);
  }

  async listByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    // 1. Fetch all distinct source_ids for this user, paginated
    const { data: distinctData, error: distinctError } = await supabase
      .from(this.tableName)
      .select("source_id, created_at")
      .eq("user_id", userId)
      .eq("source_type", this.sourceType)
      .order("created_at", { ascending: false });

    if (distinctError) handlePostgresError(distinctError);

    // Deduplicate source_ids while preserving order
    const seen = new Set<string>();
    const orderedIds: string[] = [];
    for (const row of distinctData ?? []) {
      if (!seen.has(row.source_id)) {
        seen.add(row.source_id);
        orderedIds.push(row.source_id);
      }
    }

    const totalCount = orderedIds.length;
    const start = (pageNumber - 1) * pageSize;
    const pageIds = orderedIds.slice(start, start + pageSize);

    if (pageIds.length === 0) {
      return { list: [], count: totalCount };
    }

    // 2. Fetch all rows for the paginated transaction IDs
    const { data: rows, error: rowsError } = await supabase
      .from(this.tableName)
      .select("*")
      .in("source_id", pageIds)
      .eq("user_id", userId);

    if (rowsError) handlePostgresError(rowsError);

    // 3. Group by source_id, preserving page order
    const rowsBySourceId = new Map<string, any[]>();
    for (const row of rows ?? []) {
      if (!rowsBySourceId.has(row.source_id)) {
        rowsBySourceId.set(row.source_id, []);
      }
      rowsBySourceId.get(row.source_id)!.push(row);
    }

    const list = pageIds
      .filter((id) => rowsBySourceId.has(id))
      .map((id) => this.groupToRecord(rowsBySourceId.get(id)!));

    return { list, count: totalCount };
  }

  async savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord> {
    const transactionId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const rows = prototype.props.entries.map((entry) => ({
      user_id: prototype.props.userId,
      amount: entry.amount,
      point_type: entry.pointType,
      source_id: transactionId,
      source_type: prototype.props.sourceType || this.sourceType,
      created_at: createdAt,
    }));

    const { error } = await supabase.from(this.tableName).insert(rows);

    if (error) handlePostgresError(error);

    return TransactionRecord.hydrate({
      id: transactionId,
      userId: prototype.props.userId,
      createdAt,
      entries: prototype.props.entries,
    });
  }
}
