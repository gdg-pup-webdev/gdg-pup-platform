 // src/modules/eventSystem/useCases/__tests__/UpdateEvent.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { UpdateEvent } from "../UpdateEvent";
import { Event, EventUpdateProps } from "../../domain/Event";

let eventRepository: MockEventRepository;
let updateEventUseCase: UpdateEvent;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  updateEventUseCase = new UpdateEvent(eventRepository);
};

describe("UpdateEvent Use Case", () => {
  beforeEach(initializeInstances);

  // Helper to seed an event so we can update it
  const seedEvent = async () => {
    const newEvent = Event.create({
      title: "Initial Study Jam",
      description: "Old description",
      category: "WebDev",
      venue: "TBA",
      start_date: new Date("2026-05-01T10:00:00Z"),
      end_date: new Date("2026-05-01T12:00:00Z"),
      attendance_points: 20,
    });
    return await eventRepository.saveNewEvent(newEvent);
  };

  it("should successfully update an event and return the updated entity", async () => {
    // 1. Arrange
    const originalEvent = await seedEvent();
    const eventId = originalEvent.props.id;

    const updatePayload: EventUpdateProps = {
      title: "Updated Study Jam",
      venue: "Main Auditorium",
      attendance_points: 50,
    };

    // 2. Act
    const result = await updateEventUseCase.execute(eventId, updatePayload);

    // 3. Assert - Check the returned result
    expect(result).toBeDefined();
    expect(result.props.id).toBe(eventId);
    expect(result.props.title).toBe(updatePayload.title); // Updated field
    expect(result.props.venue).toBe(updatePayload.venue); // Updated field
    expect(result.props.attendance_points).toBe(updatePayload.attendance_points); // Updated field
    
    // Ensure non-updated fields remained intact
    expect(result.props.description).toBe("Old description");
    expect(result.props.category).toBe("WebDev");
  });

  it("should persist the changes to the underlying repository", async () => {
    // 1. Arrange
    const originalEvent = await seedEvent();
    const eventId = originalEvent.props.id;

    const updatePayload: EventUpdateProps = {
      description: "Brand new description directly in repo",
    };

    // 2. Act
    await updateEventUseCase.execute(eventId, updatePayload);

    // 3. Assert - Fetch directly from the mock repository to verify persistence
    const savedEvent = await eventRepository.findById(eventId);
    expect(savedEvent.props.description).toBe(updatePayload.description);
  });

  it("should throw an error if attempting to update an event that does not exist", async () => {
    // 1. Arrange
    const invalidEventId = "fake-uuid-not-found";
    const updatePayload: EventUpdateProps = {
      title: "Ghost Event",
    };

    // 2. Act & 3. Assert
    await expect(
      updateEventUseCase.execute(invalidEventId, updatePayload)
    ).rejects.toThrowError("Event not found");
  });

  it("should guarantee that the domain entity updates its updatedAt timestamp", async () => {
    // 1. Arrange
    const originalEvent = await seedEvent();
    const eventId = originalEvent.props.id;
    const originalUpdatedAt = originalEvent.props.updatedAt;

    // Small delay to ensure timestamp difference (since vitest executes very fast)
    await new Promise((resolve) => setTimeout(resolve, 10)); 

    const updatePayload: EventUpdateProps = {
      category: "Cloud",
    };

    // 2. Act
    const result = await updateEventUseCase.execute(eventId, updatePayload);

    // 3. Assert - Domain rule: updatedAt must be refreshed on mutation
    const newUpdatedAt = result.props.updatedAt;
    
    // The new timestamp should be strictly greater than the original timestamp
    expect(new Date(newUpdatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
  });
});