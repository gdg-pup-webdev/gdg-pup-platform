/**
 * @file transaction.controller.test.ts
 * @description Transaction controller tests covering unit-level filter pass-through
 * and HTTP integration behavior with mocked services. These tests validate
 * response shape without touching the database.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionController } from "../transaction.controller.js";

const { mockListTransactions } = vi.hoisted(() => ({
  mockListTransactions: vi.fn(),
}));

vi.mock("@/modules/economySystem/transactions/transaction.service", () => ({
  transactionServiceInstance: {
    listTransactions: (...args: any[]) => mockListTransactions(...args),
  },
  TransactionService: class {},
}));

import app from "../../../../app.js";
import { testListEconomyResources } from "../../__tests__/test-helpers.js";

describe("TransactionController unit", () => {
  const transaction = {
    id: "txn-1",
    wallet_id: "wallet-1",
    amount: 10,
    source_type: "test",
    source_id: "source-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses listTransactions with userId filter", async () => {
    const service = {
      listTransactions: vi.fn().mockResolvedValue({
        list: [transaction],
        count: 1,
      }),
    };
    const controller = new TransactionController(service as any);
    const req = {
      query: { userId: "user-1", pageNumber: 1, pageSize: 10 },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await controller.listTransactions(req as any, res as any, next);

    expect(service.listTransactions).toHaveBeenCalledWith(1, 10, {
      userId: "user-1",
      walletId: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: [transaction],
        meta: expect.objectContaining({ totalRecords: 1 }),
      }),
    );
  });

  it("uses listTransactions with walletId filter", async () => {
    const service = {
      listTransactions: vi.fn().mockResolvedValue({
        list: [transaction],
        count: 1,
      }),
    };
    const controller = new TransactionController(service as any);
    const req = {
      query: { walletId: "wallet-1", pageNumber: 1, pageSize: 10 },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await controller.listTransactions(req as any, res as any, next);

    expect(service.listTransactions).toHaveBeenCalledWith(1, 10, {
      userId: undefined,
      walletId: "wallet-1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: [transaction],
        meta: expect.objectContaining({ totalRecords: 1 }),
      }),
    );
  });

  it("uses listTransactions without filters", async () => {
    const service = {
      listTransactions: vi.fn().mockResolvedValue({
        list: [transaction],
        count: 1,
      }),
    };
    const controller = new TransactionController(service as any);
    const req = {
      query: { pageNumber: 1, pageSize: 10 },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await controller.listTransactions(req as any, res as any, next);

    expect(service.listTransactions).toHaveBeenCalledWith(1, 10, {
      userId: undefined,
      walletId: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: [transaction],
        meta: expect.objectContaining({ totalRecords: 1 }),
      }),
    );
  });
});

describe("TransactionController integration", () => {
  const transaction = {
    id: "txn-1",
    wallet_id: "wallet-1",
    amount: 10,
    source_type: "test",
    source_id: "source-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/economy-system/transactions returns list by page", async () => {
    await testListEconomyResources(
      app,
      "/api/economy-system/transactions",
      mockListTransactions,
      transaction,
      {},
      [1, 10, { userId: undefined, walletId: undefined }],
    );
  });

  it("GET /api/economy-system/transactions?userId= returns user list", async () => {
    await testListEconomyResources(
      app,
      "/api/economy-system/transactions",
      mockListTransactions,
      transaction,
      { userId: "user-1" },
      [1, 10, { userId: "user-1", walletId: undefined }],
    );
  });

  it("GET /api/economy-system/transactions?walletId= returns wallet list", async () => {
    await testListEconomyResources(
      app,
      "/api/economy-system/transactions",
      mockListTransactions,
      transaction,
      { walletId: "wallet-1" },
      [1, 10, { userId: undefined, walletId: "wallet-1" }],
    );
  });
});
