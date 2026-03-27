import { describe, expect, it, beforeEach } from "vitest";
import { EventSystemController } from "../EventSystemController";
import { MockEventRepository } from "../infrastructure/mocks/MockEventRepository";
import { MockAttendanceRepository } from "../infrastructure/mocks/MockAttendanceRepository";
import { MockEventPointsService } from "../infrastructure/mocks/MockEventPointsService";
import { MockBevyEventService } from "../infrastructure/mocks/MockBevyEventService";
import { CheckinToEvent } from "../useCases/CheckinToEvent";
import { CreateEvent } from "../useCases/CreateEvent";
import { CreateEventFromBevyEventUseCase } from "../useCases/CreateEventFromBevyEvent";
import { DeleteEvent } from "../useCases/DeleteEvent";
import { GetOneEvent } from "../useCases/GetOneEvent";
import { ListEventAttendees } from "../useCases/ListEventAttendees";
import { ListEvents } from "../useCases/ListEvents";
import { UpdateEvent } from "../useCases/UpdateEvent";
import { Event } from "../domain/Event";

let controller: EventSystemController;
let eventRepository: MockEventRepository;
let attendanceRepository: MockAttendanceRepository;
let pointsService: MockEventPointsService;
let bevyEventService: MockBevyEventService;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  attendanceRepository = new MockAttendanceRepository();
  pointsService = new MockEventPointsService();
  bevyEventService = new MockBevyEventService();

  const checkinToEventUseCase = new CheckinToEvent(
    eventRepository,
    attendanceRepository,
    pointsService,
  );
  const createEventUseCase = new CreateEvent(eventRepository);
  const createEventFromBevyEventUseCase = new CreateEventFromBevyEventUseCase(
    eventRepository,
    bevyEventService,
  );
  const deleteEventUseCase = new DeleteEvent(eventRepository);
  const getOneEventUseCase = new GetOneEvent(eventRepository);
  const listEventAttendeesUseCase = new ListEventAttendees(
    attendanceRepository,
  );
  const listEventsUseCase = new ListEvents(eventRepository);
  const updateEventUseCase = new UpdateEvent(eventRepository);

  controller = new EventSystemController(
    checkinToEventUseCase,
    createEventUseCase,
    createEventFromBevyEventUseCase,
    deleteEventUseCase,
    getOneEventUseCase,
    listEventAttendeesUseCase,
    listEventsUseCase,
    updateEventUseCase,
  );
};

describe("EventSystemController", () => {
  beforeEach(initializeInstances);

  it("should create an event", async () => {
    const result = await controller.createEvent(
      "user-1",
      "Title",
      "Desc",
      "Cat",
      "Venue",
      "2026-03-01T10:00:00Z",
      "2026-03-01T12:00:00Z",
      10,
    );

    expect(result.id).toBeDefined();
    expect(result.title).toBe("Title");
    expect(result.creatorId).toBe("user-1");
  });

  it("should get one event", async () => {
    const event = Event.create({
      creatorId: "user-1",
      title: "Title",
      description: "Desc",
      category: "Cat",
      venue: "Venue",
      start_date: new Date(),
      end_date: new Date(),
      attendance_points: 10,
      bevy_event_id: null,
      image_url: null,
    });
    await eventRepository.saveNew(event);

    const result = await controller.getOneEvent(event.props.id);
    expect(result.id).toBe(event.props.id);
  });

  it("should check in to an event", async () => {
    const event = Event.create({
      creatorId: "user-1",
      title: "Title",
      description: "Desc",
      category: "Cat",
      venue: "Venue",
      start_date: new Date(),
      end_date: new Date(),
      attendance_points: 10,
      bevy_event_id: null,
      image_url: null,
    });
    await eventRepository.saveNew(event);

    const result = await controller.checkinToEvent(event.props.id, "user-2", "QR_CODE");
    expect(result.eventId).toBe(event.props.id);
    expect(result.userId).toBe("user-2");
    expect(result.newUserPoints).toBe(10);
  });
});
