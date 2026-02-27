// src/modules/eventSystem/useCases/__tests__/DeleteEvent.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { DeleteEvent } from "../DeleteEvent";
import { Event } from "../../domain/Event";

let eventRepository: MockEventRepository;
let deleteEventUseCase: DeleteEvent;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  deleteEventUseCase = new DeleteEvent(eventRepository);
};

describe("DeleteEvent Use Case", () => {
  beforeEach(initializeInstances);

  // Helper to seed an event so we have something to delete
  const seedEvent = async () => {
    const newEvent = Event.create({
      title: "Tailwind CSS Workshop",
      description: "Mastering utility classes",
      category: "WebDev",
      venue: "Discord",
      start_date: new Date(),
      end_date: new Date(Date.now() + 3600000),
      attendance_points: 30,
    });
    return await eventRepository.saveNewEvent(newEvent);
  };

  it("should successfully delete an existing event and return true", async () => {
    // 1. Arrange - Seed an event
    const event = await seedEvent();
    const eventId = event.props.id;

    // Verify it was actually added
    expect(eventRepository.events.length).toBe(1);

    // 2. Act
    const result = await deleteEventUseCase.execute(eventId);

    // 3. Assert - Check the return value
    expect(result).toBe(true);
  });

  it("should remove the event from the underlying repository", async () => {
    // 1. Arrange - Seed an event
    const event = await seedEvent();
    const eventId = event.props.id;

    // 2. Act
    await deleteEventUseCase.execute(eventId);

    // 3. Assert - Check the internal state of the repository
    expect(eventRepository.events.length).toBe(0);

    // Attempting to find the deleted event should now throw an error
    await expect(eventRepository.findById(eventId)).rejects.toThrowError(
      "Event not found",
    );
  });

  it("should throw an error if attempting to delete an event that does not exist", async () => {
    // 1. Arrange
    const invalidEventId = "fake-uuid-1234";

    // 2. Act & 3. Assert - Expect the repository's error to bubble up
    await expect(
      deleteEventUseCase.execute(invalidEventId),
    ).rejects.toThrowError("Event not found");
  });
});
