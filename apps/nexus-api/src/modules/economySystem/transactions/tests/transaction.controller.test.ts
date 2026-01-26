import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import { TransactionController } from "../transaction.controller.js";

const {
  mockListTransactionsOfUser,
  mockListTransactionsOfWallet,
  mockListTransactionsByPage,
} = vi.hoisted(() => ({
  mockListTransactionsOfUser: vi.fn(),
  mockListTransactionsOfWallet: vi.fn(),
  mockListTransactionsByPage: vi.fn(),
}));

vi.mock("@/modules/economySystem/transactions/transaction.service", () => ({
  transactionServiceInstance: {
    listTransactionsOfUser: (...args: any[]) => mockListTransactionsOfUser(...args),
    listTransactionsOfWallet: (...args: any[]) =>
      mockListTransactionsOfWallet(...args),
    listTransactionsByPage: (...args: any[]) => mockListTransactionsByPage(...args),
  },
  TransactionService: class {},
}));

import app from "../../../../app.js";

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

  it("uses listTransactionsOfUser when userId exists", async () => {
    const service = {
      listTransactionsOfUser: vi.fn().mockResolvedValue({
        list: [transaction],
        count: 1,
      }),
      listTransactionsOfWallet: vi.fn(),
      listTransactionsByPage: vi.fn(),
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

    expect(service.listTransactionsOfUser).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: [transaction],
        meta: expect.objectContaining({ totalRecords: 1 }),
      }),
    );
  });

  it("uses listTransactionsOfWallet when walletId exists", async () => {
    const service = {
      listTransactionsOfUser: vi.fn(),
      listTransactionsOfWallet: vi.fn().mockResolvedValue({
        list: [transaction],
        count: 1,
      }),
      listTransactionsByPage: vi.fn(),
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

    expect(service.listTransactionsOfWallet).toHaveBeenCalledWith("wallet-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: [transaction],
        meta: expect.objectContaining({ totalRecords: 1 }),
      }),
    );
  });

  it("uses listTransactionsByPage when no filters", async () => {
    const service = {
      listTransactionsOfUser: vi.fn(),
      listTransactionsOfWallet: vi.fn(),
      listTransactionsByPage: vi.fn().mockResolvedValue({
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

    expect(service.listTransactionsByPage).toHaveBeenCalledWith(1, 10);
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
    mockListTransactionsByPage.mockResolvedValue({ list: [transaction], count: 1 });

    const response = await supertest(app)
      .get("/api/economy-system/transactions")
      .query({ pageNumber: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(1);
  });

  it("GET /api/economy-system/transactions?userId= returns user list", async () => {
    mockListTransactionsOfUser.mockResolvedValue({ list: [transaction], count: 1 });

    const response = await supertest(app)
      .get("/api/economy-system/transactions")
      .query({ userId: "user-1", pageNumber: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("GET /api/economy-system/transactions?walletId= returns wallet list", async () => {
    mockListTransactionsOfWallet.mockResolvedValue({ list: [transaction], count: 1 });

    const response = await supertest(app)
      .get("/api/economy-system/transactions")
      .query({ walletId: "wallet-1", pageNumber: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});
