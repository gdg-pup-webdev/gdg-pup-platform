import { describe, it, expect, vi, beforeEach } from "vitest";
import { DatabaseError } from "@/classes/ServerError.js";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase.js", () => ({
  supabase: supabaseMock,
}));

import { TransactionRepository } from "../transaction.repository.js";

describe("TransactionRepository", () => {
  const repository = new TransactionRepository();
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

  it("listTransactionsByWalletId filters by wallet_id and counts", async () => {
    const listEqMock = vi
      .fn()
      .mockResolvedValue({ data: [transaction], error: null });
    const listSelectMock = vi.fn().mockReturnValue({ eq: listEqMock });

    const countEqMock = vi.fn().mockResolvedValue({ count: 1, error: null });
    const countSelectMock = vi.fn().mockReturnValue({ eq: countEqMock });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listTransactionsByWalletId("wallet-1");

    expect(supabaseMock.from).toHaveBeenCalledWith("wallet_transaction");
    expect(listSelectMock).toHaveBeenCalledWith("*");
    expect(listEqMock).toHaveBeenCalledWith("wallet_id", "wallet-1");
    expect(result).toEqual({ list: [transaction], count: 1 });
  });

  it("listTransactionsByWalletId maps db error to DatabaseError", async () => {
    const listEqMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "fail" } });
    const listSelectMock = vi.fn().mockReturnValue({ eq: listEqMock });

    supabaseMock.from.mockReturnValue({ select: listSelectMock });

    await expect(repository.listTransactionsByWalletId("wallet-1")).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });

  it("listTransactions orders by created_at and ranges", async () => {
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: [transaction], error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    const countSelectMock = vi.fn().mockResolvedValue({ count: 1, error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: selectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listTransactions(1, 10);

    expect(selectMock).toHaveBeenCalledWith("*");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    expect(result).toEqual({ list: [transaction], count: 1 });
  });

  it("listTransactions maps count error to DatabaseError", async () => {
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: [transaction], error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: null, error: { message: "fail" } });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: selectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    await expect(repository.listTransactions(1, 10)).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });

  it("getTransactionById filters by id", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: transaction, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.getTransactionById("txn-1");

    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("id", "txn-1");
    expect(result).toEqual(transaction);
  });

  it("createTransaction inserts and returns row", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: transaction, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    supabaseMock.from.mockReturnValue({ insert: insertMock });

    const result = await repository.createTransaction(transaction as any);

    expect(insertMock).toHaveBeenCalledWith(transaction);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(result).toEqual(transaction);
  });
});
