/**
 * @file transaction.service.test.ts
 * @description Transaction service tests validate orchestration and error
 * mapping with mocked repositories.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionService } from "../transaction.service.js";
import { RepositoryError } from "../../../../classes/ServerError.js";

const { mockTransactionRepository } = vi.hoisted(() => ({
  mockTransactionRepository: {
    listTransactionsWithFilters: vi.fn(),
    getTransactionById: vi.fn(),
    createTransaction: vi.fn(),
  },
}));

vi.mock("../transaction.repository.js", () => ({
  transactionRepositoryInstance: mockTransactionRepository,
  TransactionRepository: class {},
}));

describe("TransactionService", () => {
  const transactionService = new TransactionService();
  const transaction = {
    id: "txn-1",
    wallet_id: "wallet-1",
    amount: 10,
    source_type: "test",
    source_id: "source-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listTransactions passes filters to repository", async () => {
    mockTransactionRepository.listTransactionsWithFilters.mockResolvedValue({
      list: [transaction],
      count: 1,
    });

    const result = await transactionService.listTransactions(1, 10, {
      walletId: "wallet-1",
    });

    expect(
      mockTransactionRepository.listTransactionsWithFilters,
    ).toHaveBeenCalledWith(1, 10, {
      walletId: "wallet-1",
    });
    expect(result.list).toHaveLength(1);
  });

  it("listTransactions maps repo errors to RepositoryError", async () => {
    mockTransactionRepository.listTransactionsWithFilters.mockRejectedValue(
      new Error("boom"),
    );

    await expect(
      transactionService.listTransactions(1, 10, {}),
    ).rejects.toBeInstanceOf(RepositoryError);
  });

  it("getTransaction returns transaction", async () => {
    mockTransactionRepository.getTransactionById.mockResolvedValue(transaction);

    const result = await transactionService.getTransaction("txn-1");

    expect(mockTransactionRepository.getTransactionById).toHaveBeenCalledWith("txn-1");
    expect(result).toEqual(transaction);
  });

  it("create calls repo with dto", async () => {
    mockTransactionRepository.createTransaction.mockResolvedValue(transaction);

    const result = await transactionService.create(transaction as any);

    expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(transaction);
    expect(result).toEqual(transaction);
  });
});
