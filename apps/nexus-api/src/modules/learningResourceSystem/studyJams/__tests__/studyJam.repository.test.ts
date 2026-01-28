/**
 * Study jam repository unit tests.
 *
 * Supabase is mocked to assert query structure and DatabaseError mapping
 * while keeping the database and schema untouched.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { studyJamFixture } from "../../__tests__/test-helpers.js";
import { StudyJamRepository } from "../studyJam.repository.js";

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("studyJam.repository (unit)", () => {
  const repository = new StudyJamRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("create inserts into study_jam and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: studyJamFixture,
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.create({ title: "t" } as any);

    expect(fromMock).toHaveBeenCalledWith("study_jam");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(studyJamFixture.id);
  });

  it("list performs ordered select and a count query", async () => {
    const orderMock = vi.fn().mockResolvedValue({
      data: [studyJamFixture],
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

    expect(fromMock).toHaveBeenNthCalledWith(1, "study_jam");
    expect(fromMock).toHaveBeenNthCalledWith(2, "study_jam");
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
