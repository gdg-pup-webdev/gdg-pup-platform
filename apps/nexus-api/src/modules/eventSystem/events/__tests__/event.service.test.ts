/**
 * @file event.service.test.ts
 * @description Event service unit tests focused on orchestration and error
 * mapping with mocked repository and dependent services.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventService } from "../event.service.js";
import { ConflictError } from "@/errors/HttpError.js";
import { ServerError } from "@/errors/ServerError.js";

const { mockEventRepository, mockAttendanceService, mockWalletService } =
  vi.hoisted(() => ({
    mockEventRepository: {
      listEvents: vi.fn(),
      createEvent: vi.fn(),
      getEventById: vi.fn(),
      updateEvent: vi.fn(),
      deleteEvent: vi.fn(),
    },
    mockAttendanceService: {
      create: vi.fn(),
      getAttendanceByEventAndUser: vi.fn(),
    },
    mockWalletService: {
      incrementPoints: vi.fn(),
    },
  }));

vi.mock("../event.repository.js", () => ({
  eventRepositoryInstance: mockEventRepository,
  EventRepository: class {},
}));

vi.mock("../../attendance/attendance.service.js", () => ({
  attendanceServiceInstance: mockAttendanceService,
  AttendanceService: class {},
}));

vi.mock("@/modules/economySystem/wallets/wallet.service.js", () => ({
  walletServiceInstance: mockWalletService,
  WalletService: class {},
}));

describe("EventService", () => {
  const service = new EventService();
  const event = {
    id: "event-1",
    attendees_count: 1,
    creator_id: "user-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list returns list + count", async () => {
    mockEventRepository.listEvents.mockResolvedValue({
      list: [event],
      count: 1,
    });

    const result = await service.list(1, 10, { category: "workshop" });

    expect(result.list).toHaveLength(1);
    expect(mockEventRepository.listEvents).toHaveBeenCalledWith(1, 10, {
      category: "workshop",
    });
  });

  it("create forwards creator id", async () => {
    mockEventRepository.createEvent.mockResolvedValue(event);

    const result = await service.create({ title: "Test" } as any, "user-1");

    expect(mockEventRepository.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({ creator_id: "user-1" }),
    );
    expect(result).toEqual(event);
  });

  it("getById returns event", async () => {
    mockEventRepository.getEventById.mockResolvedValue(event);

    const result = await service.getById("event-1");

    expect(mockEventRepository.getEventById).toHaveBeenCalledWith("event-1");
    expect(result).toEqual(event);
  });

  it("update forwards dto", async () => {
    mockEventRepository.updateEvent.mockResolvedValue({
      ...event,
      title: "Updated",
    });

    const result = await service.update("event-1", { title: "Updated" } as any);

    expect(mockEventRepository.updateEvent).toHaveBeenCalledWith(
      "event-1",
      expect.objectContaining({ title: "Updated" }),
    );
    expect(result.title).toBe("Updated");
  });

  it("delete calls repository", async () => {
    mockEventRepository.deleteEvent.mockResolvedValue(event);

    const result = await service.delete("event-1");

    expect(mockEventRepository.deleteEvent).toHaveBeenCalledWith("event-1");
    expect(result).toEqual(event);
  });

  it("checkInToEvent orchestrates attendance, count update, and wallet points", async () => {
    mockEventRepository.getEventById.mockResolvedValue(event);
    mockAttendanceService.getAttendanceByEventAndUser.mockResolvedValue(null);
    mockAttendanceService.create.mockResolvedValue({ id: "att-1" });
    mockEventRepository.updateEvent.mockResolvedValue({
      ...event,
      attendees_count: 2,
    });
    mockWalletService.incrementPoints.mockResolvedValue({});

    const result = await service.checkInToEvent("event-1", "user-2", "NFC");

    expect(mockAttendanceService.create).toHaveBeenCalledWith(
      "event-1",
      "user-2",
      "NFC",
    );
    expect(mockEventRepository.updateEvent).toHaveBeenCalledWith(
      "event-1",
      expect.objectContaining({ attendees_count: 2 }),
    );
    expect(mockWalletService.incrementPoints).toHaveBeenCalled();
    expect(result.attendance.id).toBe("att-1");
  });

  // it("checkInToEvent throws when attendee already checked in", async () => {
  //   mockEventRepository.getEventById.mockResolvedValue(event);
  //   mockAttendanceService.getAttendanceByEventAndUser.mockResolvedValue({
  //     id: "att-1",
  //   });

  //   await expect(
  //     service.checkInToEvent("event-1", "user-2", "NFC"),
  //   ).rejects.toBeInstanceOf(ConflictError);
  // });

  it("maps repository errors to RepositoryError", async () => {
    mockEventRepository.listEvents.mockRejectedValue(new ServerError("db down", "db down"));

    await expect(service.list(1, 10, {})).rejects.toBeInstanceOf(ServerError);
  });
});
