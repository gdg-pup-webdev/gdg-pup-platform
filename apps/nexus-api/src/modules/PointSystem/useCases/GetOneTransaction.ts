import { ITransactionRepository } from "../domain/ITransactionRepository";
import { TransactionRecord } from "../domain/TransactionRecord";

export class GetOneTransaction {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(transactionId: string): Promise<TransactionRecord | null> {
    const transactionRecord =
      await this.transactionRepository.findById(transactionId);

    return transactionRecord;
  }
}
