import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import { TransactionRecord } from "../domain/TransactionRecord.js";

/**
 * ListUserTransactions Use Case
 *
 * Returns a paginated list of transactions for a user.
 */
export class ListUserTransactions {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TransactionRecord[]; count: number }> {
    return this.transactionRepository.listByUserId(
      userId,
      pageNumber,
      pageSize,
    );
  }
}
