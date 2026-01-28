/**
 * External resource repository unit tests.
 *
 * Supabase is mocked to assert table usage, query chains, and DatabaseError
 * mapping without touching real schemas or data.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { externalResourceFixture } from "../../__tests__/test-helpers.js";
import { ExternalResourceRepository } from "../externalResource.repository.js";

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("externalResource.repository (unit)", () => {
  const repository = new ExternalResourceRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("create inserts into external_resource and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: externalResourceFixture,
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.create({ title: "t" } as any);

    expect(fromMock).toHaveBeenCalledWith("external_resource");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(externalResourceFixture.id);
  });

  it("list performs ordered select and a count query", async () => {
    const orderMock = vi.fn().mockResolvedValue({
      data: [externalResourceFixture],
      error: null,
    });
    const selectListMock = vi.fn().mockReturnValue({ order: orderMock });

    const selectCountMock = vi.fn().mockResolvedValue({
      count: 1,
      error: null,
    });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.list();

    expect(fromMock).toHaveBeenNthCalledWith(1, "external_resource");
    expect(fromMock).toHaveBeenNthCalledWith(2, "external_resource");
    expect(result.count).toBe(1);
    expect(result.list).toHaveLength(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    await expect(repository.create({} as any)).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });
});
