import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import {
  NotFoundError,
  RepositoryError,
} from "../../../classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { models } from "@packages/nexus-api-contracts";

/**
 * Service for managing transaction business logic.
 * Orchestrates data access via the TransactionRepository and handles error mapping.
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
   * @throws {RepositoryError} If the repository operation fails.
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
    const { data, error } = await tryCatch(
      async () =>
        await this.transactionRepository.listTransactionsWithFilters(
          pageNumber,
          pageSize,
          filters,
        ),
      "listing transactions",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transactions not found.");

    return data;
  };

  /**
   * Retrieves a specific transaction by ID.
   *
   * @returns A promise resolving to the transaction data.
   * @throws {RepositoryError} If the repository operation fails.
   * @throws {NotFoundError} If the transaction does not exist.
   */
  getTransaction = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.transactionRepository.getTransactionById(id),
      "fetching transaction",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };

  /**
   * Creates a new transaction.
   *
   * @returns A promise resolving to the created transaction.
   * @throws {RepositoryError} If the repository operation fails.
   * @throws {NotFoundError} If the created transaction is not returned.
   */
  create = async (dto: models.economySystem.transaction.insertDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.transactionRepository.createTransaction(dto),
      "creating transaction",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };
}

export const transactionServiceInstance = new TransactionService();
