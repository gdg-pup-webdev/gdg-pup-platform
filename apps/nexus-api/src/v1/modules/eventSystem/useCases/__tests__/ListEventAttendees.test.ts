 // src/modules/eventSystem/useCases/__tests__/ListEventAttendees.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockAttendanceRepository } from "../../infrastructure/MockAttendanceRepository";
import { ListEventAttendees } from "../ListEventAttendees";
import { Attendance } from "../../domain/Attendance";

let attendanceRepository: MockAttendanceRepository;
let listEventAttendeesUseCase: ListEventAttendees;

const initializeInstances = () => {
  attendanceRepository = new MockAttendanceRepository();
  listEventAttendeesUseCase = new ListEventAttendees(attendanceRepository);
};

describe("ListEventAttendees Use Case", () => {
  beforeEach(initializeInstances);

  // Helper function to seed attendance records quickly
  const seedAttendance = async (eventId: string, userId: string) => {
    const newAttendance = Attendance.create({
      eventId: eventId,
      userId: userId,
      checkInMethod: "QR_CODE",
    });
    return await attendanceRepository.persistNewAttendance(newAttendance);
  };

  it("should return a list of attendees and the total count for a specific event", async () => {
    // 1. Arrange - Seed data for two different events to test filtering
    const targetEventId = "event_123";
    const otherEventId = "event_999";

    await seedAttendance(targetEventId, "user_1");
    await seedAttendance(targetEventId, "user_2");
    await seedAttendance(otherEventId, "user_3"); // Should not be returned

    // 2. Act
    const result = await listEventAttendeesUseCase.execute(1, 10, targetEventId);

    // 3. Assert
    expect(result).toBeDefined();
    expect(result.count).toBe(2);
    expect(result.list.length).toBe(2);
    
    // Verify it only pulled attendees for the target event
    result.list.forEach((attendance) => {
      expect(attendance.props.eventId).toBe(targetEventId);
    });
  });

  it("should correctly apply pagination parameters (pageNumber and pageSize)", async () => {
    // 1. Arrange - Seed 5 attendees for the same event
    const targetEventId = "event_pagination_test";
    for (let i = 1; i <= 5; i++) {
      await seedAttendance(targetEventId, `user_${i}`);
    }

    // 2. Act & 3. Assert - Page 1 (Size: 2)
    const page1 = await listEventAttendeesUseCase.execute(1, 2, targetEventId);
    expect(page1.count).toBe(5); // Total count should still be 5
    expect(page1.list.length).toBe(2);
    expect(page1.list[0].props.userId).toBe("user_1");
    expect(page1.list[1].props.userId).toBe("user_2");

    // Page 2 (Size: 2)
    const page2 = await listEventAttendeesUseCase.execute(2, 2, targetEventId);
    expect(page2.list.length).toBe(2);
    expect(page2.list[0].props.userId).toBe("user_3");
    expect(page2.list[1].props.userId).toBe("user_4");

    // Page 3 (Size: 2) - Should only have 1 item left
    const page3 = await listEventAttendeesUseCase.execute(3, 2, targetEventId);
    expect(page3.list.length).toBe(1);
    expect(page3.list[0].props.userId).toBe("user_5");
  });

  it("should return an empty list and count 0 if the event has no attendees", async () => {
    // 1. Arrange
    const emptyEventId = "event_ghost_town";

    // 2. Act
    const result = await listEventAttendeesUseCase.execute(1, 10, emptyEventId);

    // 3. Assert
    expect(result).toBeDefined();
    expect(result.count).toBe(0);
    expect(result.list).toEqual([]);
  });

  it("should return Domain Entity instances, not just raw DTOs", async () => {
    // 1. Arrange
    const targetEventId = "event_domain_test";
    await seedAttendance(targetEventId, "user_domain");

    // 2. Act
    const result = await listEventAttendeesUseCase.execute(1, 10, targetEventId);

    // 3. Assert
    const firstAttendee = result.list[0];
    expect(firstAttendee).toBeInstanceOf(Attendance);
    expect(firstAttendee.props.checkedInAt).toBeDefined();
    expect(firstAttendee.props.id).toBeDefined();
  });
});