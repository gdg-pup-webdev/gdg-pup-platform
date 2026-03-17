import { TransactionRecord, TransactionRecordPrototype } from "./TransactionRecord";

/**
 * ITransactionRepository
 *
 * Contract for persisting and retrieving TransactionRecord domain objects.
 */
export abstract class ITransactionRepository {
  abstract findById(id: string): Promise<TransactionRecord | null>;

  abstract listByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TransactionRecord[]; count: number }>;

  abstract savePrototype(
    prototype: TransactionRecordPrototype,
  ): Promise<TransactionRecord>;
}
