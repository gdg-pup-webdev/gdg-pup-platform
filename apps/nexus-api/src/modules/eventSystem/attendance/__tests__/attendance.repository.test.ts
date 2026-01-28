/**
 * @file attendance.repository.test.ts
 * @description Attendance repository tests assert Supabase query structure and
 * error mapping using a fully mocked client.
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

import { AttendanceRepository } from "../attendance.repository.js";

describe("AttendanceRepository", () => {
  const repository = new AttendanceRepository();
  const attendanceRow = {
    id: "att-1",
    event_id: "event-1",
    user_id: "user-1",
    checkin_method: "NFC",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create inserts dto and returns row", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: attendanceRow, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    supabaseMock.from.mockReturnValue({ insert: insertMock });

    const result = await repository.create(attendanceRow as any);

    expect(insertMock).toHaveBeenCalledWith(attendanceRow);
    expect(result).toEqual(attendanceRow);
  });

  it("listEventAttendees filters by event_id and counts", async () => {
    const listEqMock = vi.fn().mockResolvedValue({
      data: [{ user: { id: "user-1" } }],
      error: null,
    });
    const listSelectMock = vi.fn().mockReturnValue({ eq: listEqMock });

    const countEqMock = vi.fn().mockResolvedValue({ count: 1, error: null });
    const countSelectMock = vi.fn().mockReturnValue({ eq: countEqMock });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listEventAttendees("event-1");

    expect(listSelectMock).toHaveBeenCalledWith("*, user(*)");
    expect(listEqMock).toHaveBeenCalledWith("event_id", "event-1");
    expect(result).toEqual({ list: [{ id: "user-1" }], count: 1 });
  });

  it("listEventAttendees maps count error to DatabaseError", async () => {
    const listEqMock = vi.fn().mockResolvedValue({
      data: [{ user: { id: "user-1" } }],
      error: null,
    });
    const listSelectMock = vi.fn().mockReturnValue({ eq: listEqMock });

    const countEqMock = vi
      .fn()
      .mockResolvedValue({ count: null, error: { message: "fail" } });
    const countSelectMock = vi.fn().mockReturnValue({ eq: countEqMock });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    await expect(repository.listEventAttendees("event-1")).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });
});
