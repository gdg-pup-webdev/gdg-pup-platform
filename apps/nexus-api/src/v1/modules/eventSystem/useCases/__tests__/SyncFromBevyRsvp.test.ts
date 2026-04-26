import { beforeEach, describe, expect, it } from "vitest";
import { Event } from "../../domain/Event";
import {
  BevyEventDTO,
  IBevyEventService,
} from "../../domain/IBevyEventService";
import { IEventRepository } from "../../domain/IEventRepository";
import { ImportAndSyncAllToBevy } from "../ImportAndSyncAllToBevy";
import { SyncEventToBevy } from "../SyncEventToBevy";

class MockEventRepository extends IEventRepository {
  eventById: Event | null = null;
  eventByBevyId: Event | undefined = undefined;
  eventByBevyIdMap: Record<string, Event | undefined> = {};
  savedEvents: Event[] = [];
  updatedEvents: Event[] = [];

  async saveNew(event: Event): Promise<Event> {
    this.savedEvents.push(event);
    return event;
  }

  async persistUpdates(event: Event): Promise<Event> {
    this.updatedEvents.push(event);
    return event;
  }

  async deleteEvent(_eventId: string): Promise<void> {
    return undefined;
  }

  async findById(_eventId: string): Promise<Event> {
    if (!this.eventById) {
      throw new Error("Event not found");
    }
    return this.eventById;
  }

  async findByBevyId(bevyEventId: string): Promise<Event | undefined> {
    return this.eventByBevyIdMap[bevyEventId] ?? this.eventByBevyId;
  }

  async listEvents(): Promise<{ list: Event[]; count: number }> {
    return { list: [], count: 0 };
  }

  async listEventsByYear(): Promise<{ list: Event[]; count: number }> {
    return { list: [], count: 0 };
  }

  async findByType(): Promise<{ list: Event[]; count: number }> {
    return { list: [], count: 0 };
  }

  async findByTeamId(): Promise<{ list: Event[]; count: number }> {
    return { list: [], count: 0 };
  }
}

class MockBevyEventService implements IBevyEventService {
  bevyById: BevyEventDTO | undefined;
  bevyPages: Array<{ list: BevyEventDTO[]; totalPages: number }> = [];

  async getById(_id: string): Promise<BevyEventDTO | undefined> {
    return this.bevyById;
  }

  async listEvents(pageNumber: number): Promise<{
    list: BevyEventDTO[];
    totalEvents: number;
    totalPages: number;
  }> {
    const page = this.bevyPages[pageNumber - 1] || { list: [], totalPages: 1 };
    return {
      list: page.list,
      totalEvents: page.list.length,
      totalPages: page.totalPages,
    };
  }
}

const makeEvent = (bevyEventId: string, rsvp: number | null = null) =>
  Event.hydrate({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: null,
    title: "Local Event",
    description: "desc",
    category: "workshop",
    venue: "Hall",
    start_date: new Date("2026-01-01T00:00:00.000Z"),
    end_date: new Date("2026-01-01T02:00:00.000Z"),
    attendance_points: 10,
    attendees_count: 0,
    rsvp,
    bevy_event_id: bevyEventId,
    image_url: null,
    images: [],
    bevyPreviewUrl: null,
    short_description: null,
    max_capacity: 100,
    tags: [],
    speakers: [],
    type: null,
    teamId: null,
  });

const makeBevy = (id: string, attendees: number | null) =>
  new BevyEventDTO({
    id,
    title: "Bevy Event",
    description: "bevy desc",
    short_description: "short",
    event_type: "workshop",
    location: "Online",
    start_date: "2026-01-01T00:00:00.000Z",
    end_date: "2026-01-01T02:00:00.000Z",
    url: "https://example.com",
    tags: ["gdg"],
    max_capacity: 300,
    image_url: null,
    total_attendees: attendees,
  });

describe("Bevy RSVP synchronization", () => {
  let repo: MockEventRepository;
  let bevy: MockBevyEventService;

  beforeEach(() => {
    repo = new MockEventRepository();
    bevy = new MockBevyEventService();
  });

  it("syncEventToBevy updates event.rsvp from Bevy total_attendees", async () => {
    const event = makeEvent("123", null);
    repo.eventById = event;
    bevy.bevyById = makeBevy("123", 39);

    const useCase = new SyncEventToBevy(repo, bevy);
    const result = await useCase.execute(event.props.id);

    expect(result.props.rsvp).toBe(39);
    expect(repo.updatedEvents).toHaveLength(1);
    expect(repo.updatedEvents[0].props.rsvp).toBe(39);
  });

  it("importAndSyncAllToBevy syncs existing events and creates new events with rsvp", async () => {
    const existing = makeEvent("111", null);
    repo.eventByBevyIdMap["111"] = existing;

    bevy.bevyPages = [
      {
        totalPages: 1,
        list: [makeBevy("111", 25), makeBevy("222", 10)],
      },
    ];

    const useCase = new ImportAndSyncAllToBevy(bevy, repo);
    const result = await useCase.execute();

    expect(result.successCount).toBe(2);
    expect(result.failCount).toBe(0);

    expect(repo.updatedEvents).toHaveLength(1);
    expect(repo.updatedEvents[0].props.bevy_event_id).toBe("111");
    expect(repo.updatedEvents[0].props.rsvp).toBe(25);

    expect(repo.savedEvents).toHaveLength(1);
    expect(repo.savedEvents[0].props.bevy_event_id).toBe("222");
    expect(repo.savedEvents[0].props.rsvp).toBe(10);
  });
});
