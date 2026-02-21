import { ITransactionRepository } from "../domain/ITransactionRepository";

export class ListUserTransactions {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(pageNumber: number, pageSize: number, userId: string) {
    const result = await this.transactionRepository.listUserTransactions(
      pageNumber,
      pageSize,
      userId,
    );

    return result;
  }
}
