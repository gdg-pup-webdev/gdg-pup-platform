import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
<<<<<<< HEAD:apps/nexus-api/src/deprecated/walletSystem/transactions/transaction.service.ts
import { NotFoundError } from "@/errors/HttpError.js";
=======
import { NotFoundError } from "@/v0/errors/HttpError.js"; 
>>>>>>> dev:apps/nexus-api/src/v0/modules/walletSystem/transactions/transaction.service.ts
import { models } from "@packages/nexus-api-contracts";
import { TransactionInsert } from "./transaction.types.js";

/**
 * @deprecated
 */
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository = transactionRepositoryInstance,
  ) {}

  /**
   * Lists transactions based on provided filters.
   * Delegates filter logic to the repository.
   *
   * @param filters - Object containing optional filters (userId, walletId).
   * @returns A promise resolving to the list of transactions and count.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   * @throws {NotFoundError} If no transactions are found (though empty list is usually valid, this depends on repo behavior).
   */
  listTransactions = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      userId?: string;
      walletId?: string;
    },
  ) => {
    const data = await this.transactionRepository.listTransactionsWithFilters(
      pageNumber,
      pageSize,
      filters,
    );
    if (!data) throw new NotFoundError("Transactions not found.");

    return data;
  };

  /**
   * Retrieves a specific transaction by ID.
   *
   * @returns A promise resolving to the transaction data.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   * @throws {NotFoundError} If the transaction does not exist.
   */
  getTransaction = async (id: string) => {
    const data = await this.transactionRepository.getTransactionById(id);

    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };

  /**
   * Creates a new transaction.
   *
   * @returns A promise resolving to the created transaction.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   * @throws {NotFoundError} If the created transaction is not returned.
   */
  create = async (dto: TransactionInsert) => {
    const data = await this.transactionRepository.createTransaction(dto);

    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };
}
/**
 * @deprecated
 */
export const transactionServiceInstance = new TransactionService();
