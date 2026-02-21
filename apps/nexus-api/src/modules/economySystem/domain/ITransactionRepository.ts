import { TransactionRecord } from "./TransactionRecord";

export abstract class ITransactionRepository {
  constructor() {}

  abstract findById(id: string): Promise<TransactionRecord | null>;

  abstract listUserTransactions(pageNumber: number, pageSize: number, userId: string): Promise<{
    list: TransactionRecord[];
    count: number;
  }>;
}
