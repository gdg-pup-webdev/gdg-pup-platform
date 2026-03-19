import { describe, expect, it, beforeEach, vi } from "vitest";
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
import { CreateEventFromBevyEventUseCase } from "../CreateEventFromBevyEvent";
import { IBevyEventService, BevyEventDTO } from "../../domain/IBevyEventService";

describe("CreateEventFromBevyEvent Use Case", () => {
  let eventRepository: MockEventRepository;
  let bevyEventService: IBevyEventService;
  let useCase: CreateEventFromBevyEventUseCase;

  const mockBevyEvent: BevyEventDTO = {
    id: "bevy-123",
    title: "Bevy Event Title",
    description: "Bevy Event Description",
    event_type: "Workshop",
    location: "Online",
    start_date: "2026-03-01T10:00:00Z",
    end_date: "2026-03-01T12:00:00Z",
  };

  beforeEach(() => {
    eventRepository = new MockEventRepository();
    bevyEventService = {
      getById: vi.fn().mockResolvedValue(mockBevyEvent),
    };
    useCase = new CreateEventFromBevyEventUseCase(
      eventRepository,
      bevyEventService,
    );
  });

  it("should create an event from a bevy event", async () => {
    const result = await useCase.execute("bevy-123");

    expect(result).toBeDefined();
    expect(result.props.title).toBe(mockBevyEvent.title);
    expect(result.props.bevy_event_id).toBe("bevy-123");
    expect(eventRepository.events.length).toBe(1);
  });

  it("should throw error if event already exists for bevy id", async () => {
    // Arrange
    await useCase.execute("bevy-123");

    // Act & Assert
    await expect(useCase.execute("bevy-123")).rejects.toThrow(
      "Event already exists for this bevy event id",
    );
  });

  it("should throw error if bevy event not found", async () => {
    // Arrange
    (bevyEventService.getById as any).mockResolvedValue(undefined);

    // Act & Assert
    await expect(useCase.execute("non-existent")).rejects.toThrow(
      "Bevy Event not found",
    );
  });
});
