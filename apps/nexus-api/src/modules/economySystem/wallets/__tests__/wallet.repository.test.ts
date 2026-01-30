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
    const listSelectMock = vi
      .fn()
      .mockResolvedValue({ data: [wallet], error: null });
    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: 1, error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.list();

    expect(result).toEqual({ list: [wallet], count: 1 });
  });

  it("list maps count error to DatabaseError", async () => {
    const listSelectMock = vi
      .fn()
      .mockResolvedValue({ data: [wallet], error: null });
    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: null, error: { message: "fail" } });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    await expect(repository.list()).rejects.toBeInstanceOf(DatabaseError);
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
