import { ITransactionRepository } from "../domain/ITransactionRepository";
import {
  TransactionRecord,
  TransactionRecordPrototype,
  TransactionRecordProps,
} from "../domain/TransactionRecord";

export class MockTransactionRepository extends ITransactionRepository {
  private transactions: TransactionRecord[] = [];

  async findById(id: string): Promise<TransactionRecord | null> {
    const record = this.transactions.find((t) => t.props.id === id);
    return record || null;
  }

  async listUserTransactions(
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    const userLogs = this.transactions.filter((t) => t.props.userId === userId);

    // Simple pagination logic
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const list = userLogs.slice(start, end);

    return {
      list,
      count: userLogs.length,
    };
  }

  async savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord> {
    // Simulate DB behavior: adding ID and Timestamp
    const fullProps: TransactionRecordProps = {
      ...prototype.props,
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    // Note: Since TransactionRecord is abstract in your snippet,
    // you'll need a concrete class. Assuming a simple implementation:
    const newRecord = new (class extends TransactionRecord {})(fullProps);

    this.transactions.push(newRecord);
    return newRecord;
  }
}
