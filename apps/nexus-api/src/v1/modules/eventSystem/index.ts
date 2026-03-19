// Domain & Interfaces
export { Event } from "./domain/Event";
export { Attendance } from "./domain/Attendance";
export { IEventRepository } from "./domain/IEventRepository";
export { IAttendanceRepository } from "./domain/IAttendanceRepository";
export { IBevyEventService } from "./domain/IBevyEventService";
export { IEventPointsService } from "./domain/IEventPointsService";

// Use Cases
export { CheckinToEvent } from "./useCases/CheckinToEvent";
export { CreateEvent } from "./useCases/CreateEvent";
export { CreateEventFromBevyEventUseCase } from "./useCases/CreateEventFromBevyEvent";
export { DeleteEvent } from "./useCases/DeleteEvent";
export { GetOneEvent } from "./useCases/GetOneEvent";
export { ListEventAttendees } from "./useCases/ListEventAttendees";
export { ListEvents } from "./useCases/ListEvents";
export { UpdateEvent } from "./useCases/UpdateEvent";

// Infrastructure (Real implementations)
import { EventRepository } from "./infrastructure/EventRepository";
import { AttendanceRepository } from "./infrastructure/AttendanceRepository";
import { BevyEventService } from "./infrastructure/BevyEventService";
import { EventPointsService } from "./infrastructure/EventPointsService";

// Other Modules Controllers for Injection
import { pointSystemController } from "../pointsSystem";
import { bevyEventController } from "../bevyEvents";

// Controller
import { EventSystemController } from "./EventSystemController";
export { EventSystemController };

// ============================================================================
// DEPENDENCY INJECTION & INITIALIZATION
// ============================================================================

const eventPointsServiceAdapter = new EventPointsService(pointSystemController);
const eventRepositoryAdapter = new EventRepository();
const attendanceRepositoryAdapter = new AttendanceRepository();
const bevyEventServiceAdapter = new BevyEventService(bevyEventController);

// Initialize Use Cases
const checkinToEventUseCase = new CheckinToEvent(
  eventRepositoryAdapter,
  attendanceRepositoryAdapter,
  eventPointsServiceAdapter,
);
const createEventUseCase = new CreateEvent(eventRepositoryAdapter);
const createEventFromBevyEventUseCase = new CreateEventFromBevyEventUseCase(
  eventRepositoryAdapter,
  bevyEventServiceAdapter,
);
const deleteEventUseCase = new DeleteEvent(eventRepositoryAdapter);
const getOneEventUseCase = new GetOneEvent(eventRepositoryAdapter);
const listEventAttendeesUseCase = new ListEventAttendees(
  attendanceRepositoryAdapter,
);
const listEventsUseCase = new ListEvents(eventRepositoryAdapter);
const updateEventUseCase = new UpdateEvent(eventRepositoryAdapter);

// Initialize Controller
export const eventSystemController = new EventSystemController(
  checkinToEventUseCase,
  createEventUseCase,
  createEventFromBevyEventUseCase,
  deleteEventUseCase,
  getOneEventUseCase,
  listEventAttendeesUseCase,
  listEventsUseCase,
  updateEventUseCase,
);
