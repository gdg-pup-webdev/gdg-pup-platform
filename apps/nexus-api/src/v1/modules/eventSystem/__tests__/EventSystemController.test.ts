import { beforeEach, describe, expect, it, vi } from "vitest";

import { EventSystemController } from "../EventSystemController";
import { Event } from "../domain/Event";

const createEventFixture = (
  overrides: Partial<Parameters<typeof Event.hydrate>[0]> = {},
) =>
  Event.hydrate({
    id: "11111111-1111-1111-1111-111111111111",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    creatorId: "22222222-2222-2222-2222-222222222222",
    title: "Test Event",
    description: "Test description",
    category: "Study Jam",
    venue: "GDG Hall",
    start_date: new Date("2026-02-10T10:00:00.000Z"),
    end_date: new Date("2026-02-10T12:00:00.000Z"),
    attendance_points: 10,
    attendees_count: 3,
    bevy_event_id: null,
    image_url: null,
    images: [],
    bevyPreviewUrl: null,
    short_description: "Short desc",
    max_capacity: 100,
    tags: ["UX / UI Design"],
    speakers: ["Speaker 1"],
    type: "Study Jam",
    teamId: "33333333-3333-3333-3333-333333333333",
    teamName: "GDG PUP",
    ...overrides,
    rsvp: overrides.rsvp ?? null,
  });

describe("EventSystemController", () => {
  let controller: EventSystemController;

  const checkinToEventUseCase = { execute: vi.fn() };
  const createEventUseCase = { execute: vi.fn() };
  const createEventFromBevyEventUseCase = { execute: vi.fn() };
  const deleteEventUseCase = { execute: vi.fn() };
  const getOneEventUseCase = { execute: vi.fn() };
  const listEventAttendeesUseCase = { execute: vi.fn() };
  const listEventsUseCase = { execute: vi.fn() };
  const updateEventUseCase = { execute: vi.fn() };
  const listEventsByYearUseCase = { execute: vi.fn() };
  const getEventsByTypeUseCase = { execute: vi.fn() };
  const getEventsByTeamUseCase = { execute: vi.fn() };
  const addEventImageUseCase = { execute: vi.fn() };
  const deleteEventImageUseCase = { execute: vi.fn() };
  const reorderEventImagesUseCase = { execute: vi.fn() };
  const importAndSyncAllToBevyUseCase = { execute: vi.fn() };
  const syncEventToBevyUseCase = { execute: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new EventSystemController(
      checkinToEventUseCase as any,
      createEventUseCase as any,
      createEventFromBevyEventUseCase as any,
      deleteEventUseCase as any,
      getOneEventUseCase as any,
      listEventAttendeesUseCase as any,
      listEventsUseCase as any,
      updateEventUseCase as any,
      listEventsByYearUseCase as any,
      getEventsByTypeUseCase as any,
      getEventsByTeamUseCase as any,
      addEventImageUseCase as any,
      deleteEventImageUseCase as any,
      reorderEventImagesUseCase as any,
      importAndSyncAllToBevyUseCase as any,
      syncEventToBevyUseCase as any,
    );
  });

  it("includes teamName in listEvents response", async () => {
    listEventsUseCase.execute.mockResolvedValue({
      list: [createEventFixture({ teamName: "GDG PUP" })],
      count: 1,
    });

    const result = await controller.listEvents(1, 10);

    expect(result.count).toBe(1);
    expect(result.list).toHaveLength(1);
    expect(result.list[0].teamName).toBe("GDG PUP");
  });

  it("includes teamName in getOneEvent response", async () => {
    getOneEventUseCase.execute.mockResolvedValue(
      createEventFixture({ teamName: "Web Team" }),
    );

    const result = await controller.getOneEvent(
      "11111111-1111-1111-1111-111111111111",
    );

    expect(result.teamName).toBe("Web Team");
  });

  it("returns null when teamName is not set", async () => {
    getOneEventUseCase.execute.mockResolvedValue(
      createEventFixture({ teamName: null }),
    );

    const result = await controller.getOneEvent(
      "11111111-1111-1111-1111-111111111111",
    );

    expect(result.teamName).toBeNull();
  });
});
