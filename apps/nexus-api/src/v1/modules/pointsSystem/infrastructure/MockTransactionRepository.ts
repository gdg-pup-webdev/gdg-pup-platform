import { ITransactionRepository } from "../domain/ITransactionRepository";
import {
  TransactionRecord,
  TransactionRecordProps,
  TransactionRecordPrototype,
} from "../domain/TransactionRecord";

/**
 * MockTransactionRepository
 *
 * In-memory implementation used during testing.
 */
export class MockTransactionRepository extends ITransactionRepository {
  private transactions: TransactionRecord[] = [];

  async findById(id: string): Promise<TransactionRecord | null> {
    return this.transactions.find((t) => t.props.id === id) ?? null;
  }

  async listByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    const userTxs = this.transactions.filter((t) => t.props.userId === userId);
    const start = (pageNumber - 1) * pageSize;
    const list = userTxs.slice(start, start + pageSize);
    return { list, count: userTxs.length };
  }

  async savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord> {
    const props: TransactionRecordProps = {
      ...prototype.props,
      id: `tx_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    const record = TransactionRecord.hydrate(props);
    this.transactions.push(record);
    return record;
  }

  /** Seed helper for tests */
  __seed(record: TransactionRecord): void {
    this.transactions.push(record);
  }
}
