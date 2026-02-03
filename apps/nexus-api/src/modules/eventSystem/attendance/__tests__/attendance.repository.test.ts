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

  it("listEventAttendees applies filters, order, and range", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: [{ user: { id: "user-1" } }],
      count: 1,
      error: null,
    });
    const query = {
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeMock,
    };
    const selectMock = vi.fn().mockReturnValue(query);

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.listEventAttendees(3, 5, {
      event_id: "event-1",
      user_id: "user-1",
      checkin_method: "NFC",
      is_present: true,
      created_at_gte: "2024-01-01",
      created_at_lte: "2024-01-31",
    });

    expect(selectMock).toHaveBeenCalledWith("*, user(*)", { count: "exact" });
    expect(query.eq).toHaveBeenCalledWith("event_id", "event-1");
    expect(query.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(query.eq).toHaveBeenCalledWith("checkin_method", "NFC");
    expect(query.eq).toHaveBeenCalledWith("is_present", true);
    expect(query.gte).toHaveBeenCalledWith("created_at", "2024-01-01");
    expect(query.lte).toHaveBeenCalledWith("created_at", "2024-01-31");
    expect(query.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(10, 14);
    expect(result).toEqual({ list: [{ id: "user-1" }], count: 1 });
  });

  it("listEventAttendees maps query error to DatabaseError", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: null,
      count: null,
      error: { message: "fail" },
    });
    const query = {
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeMock,
    };
    const selectMock = vi.fn().mockReturnValue(query);

    supabaseMock.from.mockReturnValue({ select: selectMock });

    await expect(
      repository.listEventAttendees(1, 10, { event_id: "event-1" }),
    ).rejects.toBeInstanceOf(DatabaseError);
  });
});
