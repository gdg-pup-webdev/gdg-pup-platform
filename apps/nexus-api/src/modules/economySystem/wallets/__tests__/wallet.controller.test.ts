/**
 * @file wallet.controller.test.ts
 * @description HTTP-level controller tests with mocked service dependencies.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest = require("supertest");

const { mockListWalletsWithFilters } = vi.hoisted(() => ({
  mockListWalletsWithFilters: vi.fn(),
}));

vi.mock("@/modules/economySystem/wallets/wallet.service", () => ({
  walletServiceInstance: {
    listWalletsWithFilters: (...args: any[]) => mockListWalletsWithFilters(...args),
  },
  WalletService: class {},
}));

vi.mock("@/modules/economySystem/transactions/transaction.service", () => ({
  transactionServiceInstance: {},
  TransactionService: class {},
}));

import app from "../../../../app.js";

describe("WalletController integration", () => {
  const wallet = {
    id: "wallet-1",
    user_id: "user-1",
    balance: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/economy-system/wallets calls listWalletsWithFilters", async () => {
    mockListWalletsWithFilters.mockResolvedValue({ list: [wallet], count: 1 });

    const response = await supertest(app)
      .get("/api/economy-system/wallets")
      .query({ pageNumber: 1, pageSize: 10 });

    expect(mockListWalletsWithFilters).toHaveBeenCalledWith(1, 10, {
      userId: null,
    });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.totalRecords).toBe(1);
  });

  it("GET /api/economy-system/wallets?userId= calls listWalletsWithFilters", async () => {
    mockListWalletsWithFilters.mockResolvedValue({ list: [wallet], count: 1 });

    const response = await supertest(app)
      .get("/api/economy-system/wallets")
      .query({ userId: "user-1", pageNumber: 1, pageSize: 10 });

    expect(mockListWalletsWithFilters).toHaveBeenCalledWith(1, 10, {
      userId: "user-1",
    });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.totalRecords).toBe(1);
  });
});
