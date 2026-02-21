// src/modules/eventSystem/useCases/__tests__/CheckinToEvent.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockAttendanceRepository } from "../../infrastructure/MockAttendanceRepository";
import { MockEventPointsService } from "../../infrastructure/MockEventPointsService";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { CheckinToEvent } from "../CheckinToEvent";
import { Event } from "../../domain/Event";

let eventRepository: MockEventRepository;
let attendanceRepository: MockAttendanceRepository;
let pointsService: MockEventPointsService;
let checkinToEventUseCase: CheckinToEvent;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  attendanceRepository = new MockAttendanceRepository();
  pointsService = new MockEventPointsService();

  checkinToEventUseCase = new CheckinToEvent(
    eventRepository,
    attendanceRepository,
    pointsService,
  );
};

describe("CheckinToEvent Use Case", () => {
  beforeEach(initializeInstances);

  // Helper function to quickly seed a valid event before tests
  const seedEvent = async (points: number = 50) => {
    const newEvent = Event.create({
      title: "React Router Study Jam",
      description: "Advanced Routing",
      category: "WebDev",
      venue: "Discord",
      start_date: new Date(),
      end_date: new Date(Date.now() + 3600000),
      attendance_points: points,
    });
    return await eventRepository.saveNewEvent(newEvent);
  };

  it("should successfully check in a user, persist records, and award points", async () => {
    // 1. Arrange
    const event = await seedEvent(100); // Event awards 100 points
    const userId = "user_789";
    const checkInMethod = "QR_CODE";

    // 2. Act
    const result = await checkinToEventUseCase.execute(
      event.props.id,
      userId,
      checkInMethod,
    );

    // 3. Assert - Check the returned object structure
    expect(result).toBeDefined();
    expect(result.attendanceRecord.props.userId).toBe(userId);
    expect(result.attendanceRecord.props.eventId).toBe(event.props.id);
    expect(result.attendanceRecord.props.checkInMethod).toBe(checkInMethod);

    // Check that the attendee number incremented
    expect(result.attendeeNumber).toBe(1);

    // Check that points were awarded accurately
    expect(result.newTotalPoints).toBe(100);
  });

  it("should throw an error if the provided event ID does not exist", async () => {
    // 1. Arrange
    const invalidEventId = "non-existent-event-id";
    const userId = "user_123";

    // 2. Act & 3. Assert
    await expect(
      checkinToEventUseCase.execute(invalidEventId, userId, "MANUAL"),
    ).rejects.toThrowError("Event not found");

    // Verify side effects did NOT happen
    expect(attendanceRepository.attendances.length).toBe(0);
    expect(pointsService.transactionLog.length).toBe(0);
  });

  it("should correctly update the Event aggregate root's attendees count in the repository", async () => {
    // 1. Arrange
    const event = await seedEvent();
    const eventId = event.props.id;

    // 2. Act - Check in two different users
    await checkinToEventUseCase.execute(eventId, "user_1", "QR_CODE");
    await checkinToEventUseCase.execute(eventId, "user_2", "MANUAL");

    // 3. Assert - Fetch the event from the repo and verify the domain logic persisted
    const updatedEvent = await eventRepository.findById(eventId);
    expect(updatedEvent.props.attendees_count).toBe(2);
  });

  it("should successfully pass the generated attendance ID to the points service for cross-domain tracking", async () => {
    // 1. Arrange
    const event = await seedEvent(75);

    // 2. Act
    const result = await checkinToEventUseCase.execute(
      event.props.id,
      "user_abc",
      "NFC_TAP",
    );

    // 3. Assert - Check the mock points service's internal log
    const recordedTransaction = pointsService.transactionLog[0];

    expect(recordedTransaction).toBeDefined();
    expect(recordedTransaction.userId).toBe("user_abc");
    expect(recordedTransaction.points).toBe(75);

    // The most critical assertion: The point system MUST receive the new Attendance ID
    expect(recordedTransaction.attendanceId).toBe(
      result.attendanceRecord.props.id,
    );
  });

  it("should accurately persist the new attendance record in the Attendance repository", async () => {
    // 1. Arrange
    const event = await seedEvent();

    // 2. Act
    await checkinToEventUseCase.execute(event.props.id, "user_spy", "QR_CODE");

    // 3. Assert
    const savedAttendances = attendanceRepository.attendances;
    expect(savedAttendances.length).toBe(1);
    expect(savedAttendances[0].props.eventId).toBe(event.props.id);
    expect(savedAttendances[0].props.userId).toBe("user_spy");
    expect(savedAttendances[0].props.checkInMethod).toBe("QR_CODE");
    expect(savedAttendances[0].props.checkedInAt).toBeDefined();
  });
});
