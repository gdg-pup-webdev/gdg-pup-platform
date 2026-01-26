import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionService } from "../transaction.service.js";
import { NotFoundError, RepositoryError } from "@/classes/ServerError.js";

const { mockWalletService, mockTransactionRepository } = vi.hoisted(() => ({
  mockWalletService: {
    getWalletByUserId: vi.fn(),
  },
  mockTransactionRepository: {
    listTransactionsByWalletId: vi.fn(),
    listTransactions: vi.fn(),
    getTransactionById: vi.fn(),
    createTransaction: vi.fn(),
  },
}));

vi.mock("../../wallets/wallet.service.js", () => ({
  walletServiceInstance: mockWalletService,
  WalletService: class {},
}));

vi.mock("../transaction.repository.js", () => ({
  transactionRepositoryInstance: mockTransactionRepository,
  TransactionRepository: class {},
}));

describe("TransactionService", () => {
  const transactionService = new TransactionService();
  const wallet = { id: "wallet-1", user_id: "user-1" };
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

  it("listTransactionsOfUser uses wallet lookup then repo list", async () => {
    mockWalletService.getWalletByUserId.mockResolvedValue(wallet);
    mockTransactionRepository.listTransactionsByWalletId.mockResolvedValue({
      list: [transaction],
      count: 1,
    });

    const result = await transactionService.listTransactionsOfUser("user-1");

    expect(mockWalletService.getWalletByUserId).toHaveBeenCalledWith("user-1");
    expect(mockTransactionRepository.listTransactionsByWalletId).toHaveBeenCalledWith(
      "wallet-1",
    );
    expect(result.list).toHaveLength(1);
  });

  it("listTransactionsOfUser throws NotFoundError when wallet missing", async () => {
    mockWalletService.getWalletByUserId.mockResolvedValue(null);

    await expect(transactionService.listTransactionsOfUser("user-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("listTransactionsOfWallet returns list + count", async () => {
    mockTransactionRepository.listTransactionsByWalletId.mockResolvedValue({
      list: [transaction],
      count: 1,
    });

    const result = await transactionService.listTransactionsOfWallet("wallet-1");

    expect(result.list).toHaveLength(1);
    expect(result.count).toBe(1);
  });

  it("listTransactionsByPage calls repo with page params", async () => {
    mockTransactionRepository.listTransactions.mockResolvedValue({
      list: [transaction],
      count: 1,
    });

    const result = await transactionService.listTransactionsByPage(1, 10);

    expect(mockTransactionRepository.listTransactions).toHaveBeenCalledWith(1, 10);
    expect(result.count).toBe(1);
  });

  it("listTransactionsByPage maps repo errors to RepositoryError", async () => {
    mockTransactionRepository.listTransactions.mockRejectedValue(new Error("boom"));

    await expect(transactionService.listTransactionsByPage(1, 10)).rejects.toBeInstanceOf(
      RepositoryError,
    );
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
