/**
 * @file wallet.repository.test.ts
 * @description Wallet repository tests validate Supabase query chains and
 * error mapping with a mocked client.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DatabaseError } from "../../../../classes/ServerError.js";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase.js", () => ({
  supabase: supabaseMock,
}));

import { WalletRepository } from "../wallet.repository.js";

describe("WalletRepository", () => {
  const repository = new WalletRepository();
  const wallet = { id: "wallet-1", user_id: "user-1", balance: 10 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listWalletsOfUser filters by user_id", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: wallet, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.listWalletsOfUser("user-1");

    expect(supabaseMock.from).toHaveBeenCalledWith("wallet");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(result).toEqual(wallet);
  });

  it("listWalletsOfUser maps db error to DatabaseError", async () => {
    const singleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "fail" } });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    await expect(repository.listWalletsOfUser("user-1")).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });

  it("list returns list + count", async () => {
    const rangeMock = vi.fn().mockResolvedValue({ data: [wallet], error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: 1, error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: selectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.list(1, 10);

    expect(selectMock).toHaveBeenCalledWith("*");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    expect(result).toEqual({ list: [wallet], count: 1 });
  });

  it("listWalletsWithFilters uses listWalletsOfUser when userId provided", async () => {
    const listWalletsOfUserSpy = vi
      .spyOn(repository, "listWalletsOfUser")
      .mockResolvedValue(wallet as any);

    const result = await repository.listWalletsWithFilters({
      userId: "user-1",
      pageNumber: 1,
      pageSize: 10,
    });

    expect(listWalletsOfUserSpy).toHaveBeenCalledWith("user-1");
    expect(result).toEqual({ list: [wallet], count: 1 });

    listWalletsOfUserSpy.mockRestore();
  });

  it("listWalletsWithFilters falls back to list when no userId", async () => {
    const listSpy = vi
      .spyOn(repository, "list")
      .mockResolvedValue({ list: [wallet], count: 1 });

    const result = await repository.listWalletsWithFilters({
      pageNumber: 1,
      pageSize: 10,
    });

    expect(listSpy).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ list: [wallet], count: 1 });

    listSpy.mockRestore();
  });

  it("list maps count error to DatabaseError", async () => {
    const rangeMock = vi.fn().mockResolvedValue({ data: [wallet], error: null });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: null, error: { message: "fail" } });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: selectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    await expect(repository.list(1, 10)).rejects.toBeInstanceOf(DatabaseError);
  });

  it("updateWalletBalance updates balance by user_id", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: wallet, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ update: updateMock });

    const result = await repository.updateWalletBalance("user-1", 20);

    expect(supabaseMock.from).toHaveBeenCalledWith("wallet");
    expect(updateMock).toHaveBeenCalledWith({ balance: 20 });
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(result).toEqual(wallet);
  });
});
