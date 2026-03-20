import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import { TransactionRecord } from "../domain/TransactionRecord.js";

/**
 * GetOneTransaction Use Case
 */
export class GetOneTransaction {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(transactionId: string): Promise<TransactionRecord | null> {
    return this.transactionRepository.findById(transactionId);
  }
}
