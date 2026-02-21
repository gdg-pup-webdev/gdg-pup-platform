/**
 * @file transaction.repository.test.ts
 * @description Repository tests verify Supabase query chains and error mapping
 * with a mocked client to avoid real database access.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase.js", () => ({
  supabase: supabaseMock,
}));

import { TransactionRepository } from "../transaction.repository.js";
import { DatabaseError } from "@/errors/DatabaseError.js";
import { TransactionRowType } from "../transaction.types.js";

describe("TransactionRepository", () => {
  const repository = new TransactionRepository();
  const transaction: TransactionRowType = {
    id: "txn-1",
    wallet_id: "wallet-1",
    amount: 10,
    source_type: "test",
    source_id: "source-1",
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listTransactionsByWalletId filters by wallet_id and counts", async () => {
    const listEqMock = vi
      .fn()
      .mockResolvedValue({ data: [transaction], error: null });
    const listRangeMock = vi.fn().mockReturnValue({ eq: listEqMock });
    const listOrderMock = vi.fn().mockReturnValue({ range: listRangeMock });
    const listSelectMock = vi.fn().mockReturnValue({ order: listOrderMock });

    const countEqMock = vi.fn().mockResolvedValue({ count: 1, error: null });
    const countSelectMock = vi.fn().mockReturnValue({ eq: countEqMock });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listTransactionsByWalletId(
      "wallet-1",
      1,
      10,
    );

    expect(supabaseMock.from).toHaveBeenCalledWith("wallet_transaction");
    expect(listSelectMock).toHaveBeenCalledWith("*");
    expect(listOrderMock).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(listRangeMock).toHaveBeenCalledWith(0, 9);
    expect(listEqMock).toHaveBeenCalledWith("wallet_id", "wallet-1");
    expect(result).toEqual({ list: [transaction], count: 1 });
  });

  it("listTransactionsByWalletId maps db error to DatabaseError", async () => {
    const listEqMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "fail" } });
    const listRangeMock = vi.fn().mockReturnValue({ eq: listEqMock });
    const listOrderMock = vi.fn().mockReturnValue({ range: listRangeMock });
    const listSelectMock = vi.fn().mockReturnValue({ order: listOrderMock });

    supabaseMock.from.mockReturnValue({ select: listSelectMock });

    await expect(
      repository.listTransactionsByWalletId("wallet-1", 1, 10),
    ).rejects.toBeInstanceOf(DatabaseError);
  });

  it("listTransactions orders by created_at and ranges", async () => {
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: [transaction], error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: 1, error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: selectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listTransactions(1, 10);

    expect(selectMock).toHaveBeenCalledWith("*");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    expect(result).toEqual({ list: [transaction], count: 1 });
  });

  // it("listTransactions maps count error to DatabaseError", async () => {
  //   const rangeMock = vi
  //     .fn()
  //     .mockResolvedValue({ data: [transaction], error: null });
  //   const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
  //   const selectMock = vi.fn().mockReturnValue({ order: orderMock });

  //   const countSelectMock = vi
  //     .fn()
  //     .mockResolvedValue({ count: null, error: { message: "fail" } });

  //   supabaseMock.from
  //     .mockImplementationOnce(() => ({ select: selectMock }))
  //     .mockImplementationOnce(() => ({ select: countSelectMock }));

  //   await expect(repository.listTransactions(1, 10)).rejects.toBeInstanceOf(
  //     DatabaseError,
  //   );
  // });

  it("listTransactionsByUserId resolves wallet then lists transactions", async () => {
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: { id: "wallet-1" }, error: null });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const listSpy = vi
      .spyOn(repository, "listTransactionsByWalletId")
      .mockResolvedValue({ list: [transaction], count: 1 });

    const result = await repository.listTransactionsByUserId("user-1", 1, 10);

    expect(supabaseMock.from).toHaveBeenCalledWith("wallet");
    expect(selectMock).toHaveBeenCalledWith("id");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(listSpy).toHaveBeenCalledWith("wallet-1", 1, 10);
    expect(result).toEqual({ list: [transaction], count: 1 });

    listSpy.mockRestore();
  });

  it("listTransactionsWithFilters prioritizes userId filter", async () => {
    const userSpy = vi
      .spyOn(repository, "listTransactionsByUserId")
      .mockResolvedValue({ list: [transaction], count: 1 });

    const result = await repository.listTransactionsWithFilters(1, 10, {
      userId: "user-1",
      walletId: "wallet-1",
    });

    expect(userSpy).toHaveBeenCalledWith("user-1", 1, 10);
    expect(result).toEqual({ list: [transaction], count: 1 });

    userSpy.mockRestore();
  });

  it("listTransactionsWithFilters uses walletId when userId missing", async () => {
    const walletSpy = vi
      .spyOn(repository, "listTransactionsByWalletId")
      .mockResolvedValue({ list: [transaction], count: 1 });

    const result = await repository.listTransactionsWithFilters(1, 10, {
      walletId: "wallet-1",
    });

    expect(walletSpy).toHaveBeenCalledWith("wallet-1", 1, 10);
    expect(result).toEqual({ list: [transaction], count: 1 });

    walletSpy.mockRestore();
  });

  it("listTransactionsWithFilters falls back to paginated list", async () => {
    const listSpy = vi
      .spyOn(repository, "listTransactions")
      .mockResolvedValue({ list: [transaction], count: 1 });

    const result = await repository.listTransactionsWithFilters(2, 5, {});

    expect(listSpy).toHaveBeenCalledWith(2, 5);
    expect(result).toEqual({ list: [transaction], count: 1 });

    listSpy.mockRestore();
  });

  it("getTransactionById filters by id", async () => {
    const singleMock = vi
      .fn()
      .mockResolvedValue({ data: transaction, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.getTransactionById("txn-1");

    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("id", "txn-1");
    expect(result).toEqual(transaction);
  });

  it("createTransaction inserts and returns row", async () => {
    const singleMock = vi
      .fn()
      .mockResolvedValue({ data: transaction, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    supabaseMock.from.mockReturnValue({ insert: insertMock });

    const result = await repository.createTransaction(transaction as any);

    expect(insertMock).toHaveBeenCalledWith(transaction);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(result).toEqual(transaction);
  });
});
