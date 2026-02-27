// src/modules/eventSystem/useCases/__tests__/ListEvents.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { ListEvents } from "../ListEvents";
import { Event } from "../../domain/Event";

let eventRepository: MockEventRepository;
let listEventsUseCase: ListEvents;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  listEventsUseCase = new ListEvents(eventRepository);
};

describe("ListEvents Use Case", () => {
  beforeEach(initializeInstances);

  // Helper function to easily seed events into our mock repository
  const seedEvent = async (title: string) => {
    const newEvent = Event.create({
      title: title,
      description: "Standard description",
      category: "WebDev",
      venue: "Online",
      start_date: new Date("2026-06-01T10:00:00Z"),
      end_date: new Date("2026-06-01T12:00:00Z"),
      attendance_points: 10,
    });
    return await eventRepository.saveNewEvent(newEvent);
  };

  it("should return a list of events and the total count", async () => {
    // 1. Arrange - Seed 3 events
    await seedEvent("Event A");
    await seedEvent("Event B");
    await seedEvent("Event C");

    // 2. Act - Request page 1 with a size large enough to catch all
    const result = await listEventsUseCase.execute(1, 10);

    // 3. Assert
    expect(result).toBeDefined();
    expect(result.count).toBe(3);
    expect(result.list.length).toBe(3);
    expect(result.list[0].props.title).toBe("Event A");
  });

  it("should correctly apply pagination parameters (pageNumber and pageSize)", async () => {
    // 1. Arrange - Seed 5 events
    for (let i = 1; i <= 5; i++) {
      await seedEvent(`Event ${i}`);
    }

    // 2. Act & 3. Assert

    // Page 1 (Size: 2)
    const page1 = await listEventsUseCase.execute(1, 2);
    expect(page1.count).toBe(5); // Total count remains 5
    expect(page1.list.length).toBe(2);
    expect(page1.list[0].props.title).toBe("Event 1");
    expect(page1.list[1].props.title).toBe("Event 2");

    // Page 2 (Size: 2)
    const page2 = await listEventsUseCase.execute(2, 2);
    expect(page2.list.length).toBe(2);
    expect(page2.list[0].props.title).toBe("Event 3");
    expect(page2.list[1].props.title).toBe("Event 4");

    // Page 3 (Size: 2) - Only 1 item left
    const page3 = await listEventsUseCase.execute(3, 2);
    expect(page3.list.length).toBe(1);
    expect(page3.list[0].props.title).toBe("Event 5");

    // Page 4 (Size: 2) - Out of bounds
    const page4 = await listEventsUseCase.execute(4, 2);
    expect(page4.list.length).toBe(0);
  });

  it("should return an empty list and count 0 if there are no events in the system", async () => {
    // 1. Arrange - Do not seed any events

    // 2. Act
    const result = await listEventsUseCase.execute(1, 10);

    // 3. Assert
    expect(result).toBeDefined();
    expect(result.count).toBe(0);
    expect(result.list).toEqual([]);
  });

  it("should return Domain Entity instances, not just plain data objects", async () => {
    // 1. Arrange
    await seedEvent("Domain Test Event");

    // 2. Act
    const result = await listEventsUseCase.execute(1, 10);

    // 3. Assert
    const firstEvent = result.list[0];
    
    // Check that it's a real class instance
    expect(firstEvent).toBeInstanceOf(Event);
    
    // Check that domain methods and getters are available
    expect(typeof firstEvent.update).toBe("function");
    expect(firstEvent.props.id).toBeDefined();
  });
});