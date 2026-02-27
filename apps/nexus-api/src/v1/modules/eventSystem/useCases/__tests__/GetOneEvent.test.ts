// src/modules/eventSystem/useCases/__tests__/GetOneEvent.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { Event } from "../../domain/Event";
import { GetOneEvent } from "../GetOneEvent";

let eventRepository: MockEventRepository;
let getOneEventUseCase: GetOneEvent;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  getOneEventUseCase = new GetOneEvent(eventRepository);
};

describe("GetOneEvent Use Case", () => {
  beforeEach(initializeInstances);

  // Helper to seed a standard event into the mock repository
  const seedEvent = async () => {
    const newEvent = Event.create({
      title: "Git & GitHub Study Jam",
      description: "Version control basics for beginners",
      category: "WebDev",
      venue: "Discord / Google Meet",
      start_date: new Date("2026-02-01T13:00:00Z"),
      end_date: new Date("2026-02-01T16:00:00Z"),
      attendance_points: 50,
    });
    return await eventRepository.saveNewEvent(newEvent);
  };

  it("should successfully retrieve and return an existing event by its ID", async () => {
    // 1. Arrange - Seed an event into the repository
    const seededEvent = await seedEvent();
    const eventId = seededEvent.props.id;

    // 2. Act - Execute the use case
    const result = await getOneEventUseCase.execute(eventId);

    // 3. Assert - Check that the returned event matches what we seeded
    expect(result).toBeDefined();
    expect(result.props.id).toBe(eventId);
    expect(result.props.title).toBe(seededEvent.props.title);
    expect(result.props.description).toBe(seededEvent.props.description);
    expect(result.props.category).toBe(seededEvent.props.category);
    expect(result.props.attendance_points).toBe(
      seededEvent.props.attendance_points,
    );
  });

  it("should throw an error if the requested event ID does not exist", async () => {
    // 1. Arrange
    const invalidEventId = "non-existent-uuid-999";

    // 2. Act & 3. Assert - The mock repository throws "Event not found"
    await expect(
      getOneEventUseCase.execute(invalidEventId),
    ).rejects.toThrowError("Event not found");
  });

  it("should return the exact domain Event entity instance", async () => {
    // 1. Arrange
    const seededEvent = await seedEvent();
    const eventId = seededEvent.props.id;

    // 2. Act
    const result = await getOneEventUseCase.execute(eventId);

    // 3. Assert - Ensure the returned object is actually an instance of the Event class
    expect(result).toBeInstanceOf(Event);

    // Ensure it has access to domain methods (like 'update' or 'addAttendance')
    expect(typeof result.update).toBe("function");
    expect(typeof result.addAttendance).toBe("function");
  });
});
