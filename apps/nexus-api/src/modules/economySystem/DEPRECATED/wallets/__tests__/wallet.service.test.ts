/**
 * @file wallet.service.test.ts
 * @description Wallet service tests validate orchestration and error mapping
 * with mocked repositories.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WalletService } from "../wallet.service.js";
import { NotFoundError } from "@/errors/HttpError.js";

const { mockWalletRepository, mockTransactionRepository } = vi.hoisted(() => ({
  mockWalletRepository: {
    listWalletsOfUser: vi.fn(),
    listWalletsWithFilters: vi.fn(),
    list: vi.fn(),
    updateWalletBalance: vi.fn(),
  },
  mockTransactionRepository: {
    createTransaction: vi.fn(),
  },
}));

vi.mock("../wallet.repository.js", () => ({
  walletRepositoryInstance: mockWalletRepository,
  WalletRepository: class {},
}));

vi.mock("../../transactions/transaction.repository.js", () => ({
  transactionRepositoryInstance: mockTransactionRepository,
  TransactionRepository: class {},
}));

describe("WalletService", () => {
  const walletService = new WalletService();
  const wallet = {
    id: "wallet-1",
    user_id: "user-1",
    balance: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getWalletByUserId returns wallet", async () => {
    mockWalletRepository.listWalletsOfUser.mockResolvedValue(wallet);

    const result = await walletService.getWalletByUserId("user-1");

    expect(result).toEqual(wallet);
    expect(mockWalletRepository.listWalletsOfUser).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("getWalletByUserId throws NotFoundError when missing", async () => {
    mockWalletRepository.listWalletsOfUser.mockResolvedValue(null);

    await expect(
      walletService.getWalletByUserId("user-1"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("listWallets returns list + count", async () => {
    mockWalletRepository.listWalletsWithFilters.mockResolvedValue({
      list: [wallet],
      count: 1,
    });

    const result = await walletService.listWallets(1, 10);

    expect(mockWalletRepository.listWalletsWithFilters).toHaveBeenCalledWith(
      1,
      10,
      {},
    );
    expect(result).toEqual({ list: [wallet], count: 1 });
  });

  it("listWalletsWithFilters returns empty list", async () => {
    mockWalletRepository.listWalletsWithFilters.mockResolvedValue({
      list: [],
      count: 0,
    });

    const result = await walletService.listWalletsWithFilters(1, 10, {
      userId: null,
    });

    expect(result).toEqual({ list: [], count: 0 });
  });

  it("incrementPoints updates balance and creates transaction", async () => {
    mockWalletRepository.listWalletsOfUser.mockResolvedValue(wallet);
    mockWalletRepository.updateWalletBalance.mockResolvedValue({
      ...wallet,
      balance: 15,
    });
    mockTransactionRepository.createTransaction.mockResolvedValue({
      id: "txn-1",
      wallet_id: wallet.id,
      amount: 5,
      source_type: "test",
      source_id: "source-1",
    });

    const result = await walletService.incrementPoints(
      "user-1",
      5,
      "test",
      "source-1",
    );

    expect(mockWalletRepository.updateWalletBalance).toHaveBeenCalledWith(
      "user-1",
      15,
    );
    expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith({
      wallet_id: wallet.id,
      amount: 5,
      source_type: "test",
      source_id: "source-1",
    });
    expect(result.transaction.id).toBe("txn-1");
  });

  it("decrementPoints updates balance and creates transaction", async () => {
    mockWalletRepository.listWalletsOfUser.mockResolvedValue(wallet);
    mockWalletRepository.updateWalletBalance.mockResolvedValue({
      ...wallet,
      balance: 7,
    });
    mockTransactionRepository.createTransaction.mockResolvedValue({
      id: "txn-2",
      wallet_id: wallet.id,
      amount: -3,
      source_type: "test",
      source_id: "source-2",
    });

    const result = await walletService.decrementPoints(
      "user-1",
      3,
      "test",
      "source-2",
    );

    expect(mockWalletRepository.updateWalletBalance).toHaveBeenCalledWith(
      "user-1",
      7,
    );
    expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith({
      wallet_id: wallet.id,
      amount: -3,
      source_type: "test",
      source_id: "source-2",
    });
    expect(result.transaction.id).toBe("txn-2");
  });
});
