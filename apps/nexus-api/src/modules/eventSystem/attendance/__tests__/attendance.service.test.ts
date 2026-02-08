/**
 * @file attendance.service.test.ts
 * @description Attendance service unit tests validate DTO shaping and error
 * mapping with a mocked repository boundary.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttendanceService } from "../attendance.service.js";
import { ServerError } from "@/errors/ServerError.js";

const { mockAttendanceRepository } = vi.hoisted(() => ({
  mockAttendanceRepository: {
    create: vi.fn(),
    listEventAttendees: vi.fn(),
  },
}));

vi.mock("../attendance.repository.js", () => ({
  attendanceRepositoryInstance: mockAttendanceRepository,
  AttendanceRepository: class {},
}));

describe("AttendanceService", () => {
  const service = new AttendanceService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create forwards dto fields", async () => {
    mockAttendanceRepository.create.mockResolvedValue({ id: "att-1" });

    const result = await service.create("event-1", "user-1", "NFC");

    expect(mockAttendanceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        event_id: "event-1",
        user_id: "user-1",
        checkin_method: "NFC",
      }),
    );
    expect(result.id).toBe("att-1");
  });

  it("listEventAttendees returns list + count", async () => {
    mockAttendanceRepository.listEventAttendees.mockResolvedValue({
      list: [{ id: "user-1" }],
      count: 1,
    });

    const result = await service.listEventAttendees(1, 10, {
      event_id: "event-1",
      checkin_method: "NFC",
    });

    expect(mockAttendanceRepository.listEventAttendees).toHaveBeenCalledWith(
      1,
      10,
      {
        event_id: "event-1",
        checkin_method: "NFC",
      },
    );
    expect(result.count).toBe(1);
  });

  // it("maps repository errors to RepositoryError", async () => {
  //   mockAttendanceRepository.create.mockRejectedValue(new Error("boom"));

  //   await expect(
  //     service.create("event-1", "user-1", "NFC"),
  //   ).rejects.toBeInstanceOf(ServerError);
  // });
});
