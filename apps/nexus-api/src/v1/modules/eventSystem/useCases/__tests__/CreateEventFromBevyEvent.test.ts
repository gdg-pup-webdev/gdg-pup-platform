import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/mocks/MockEventRepository";
import { MockBevyEventService } from "../../infrastructure/mocks/MockBevyEventService";
import { CreateEventFromBevyEventUseCase } from "../CreateEventFromBevyEvent";
import { BevyEventDTO } from "../../domain/IBevyEventService";

let eventRepository: MockEventRepository;
let bevyEventService: MockBevyEventService;
let useCase: CreateEventFromBevyEventUseCase;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  bevyEventService = new MockBevyEventService();
  useCase = new CreateEventFromBevyEventUseCase(
    eventRepository,
    bevyEventService,
  );
};

describe("CreateEventFromBevyEvent Use Case", () => {
  beforeEach(initializeInstances);

  it("should successfully create a new event from a bevy event", async () => {
    bevyEventService.addBevyEvent(
      new BevyEventDTO({
        id: "bevy-1",
        title: "Bevy Event",
        description: "Description",
        start_date: "2026-03-01T10:00:00Z",
        end_date: "2026-03-01T12:00:00Z",
        url: "https://bevy.com/events/bevy-1",
      }),
    );

    const result = await useCase.execute("bevy-1", "user-123");

    expect(result.props.title).toBe("Bevy Event");
    expect(result.props.bevy_event_id).toBe("bevy-1");
    expect(result.props.creatorId).toBe("user-123");
    expect(eventRepository.events.length).toBe(1);
  });

  it("should throw an error if the bevy event already exists in the repository", async () => {
    bevyEventService.addBevyEvent(
      new BevyEventDTO({
        id: "bevy-1",
        title: "Bevy Event",
        description: "Description",
        start_date: "2026-03-01T10:00:00Z",
        end_date: "2026-03-01T12:00:00Z",
        url: "https://bevy.com/events/bevy-1",
      }),
    );

    await useCase.execute("bevy-1", "user-123");

    await expect(useCase.execute("bevy-1", "user-123")).rejects.toThrow(
      "Event already exists",
    );
  });

  it("should throw an error if the bevy event is not found", async () => {
    await expect(useCase.execute("non-existent", "user-123")).rejects.toThrow(
      "Bevy Event not found",
    );
  });
});
