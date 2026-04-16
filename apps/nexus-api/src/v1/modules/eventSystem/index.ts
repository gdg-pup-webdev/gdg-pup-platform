// Domain & Interfaces
import { Event } from "./domain/Event";
import { Attendance } from "./domain/Attendance";
import { IEventRepository } from "./domain/IEventRepository";
import { IAttendanceRepository } from "./domain/IAttendanceRepository";
import { IBevyEventService } from "./domain/IBevyEventService";
import { IEventPointsService } from "./domain/IEventPointsService";

// Use Cases
import { CheckinToEvent } from "./useCases/CheckinToEvent";
import { CreateEvent } from "./useCases/CreateEvent";
import { CreateEventFromBevyEventUseCase } from "./useCases/CreateEventFromBevyEvent";
import { DeleteEvent } from "./useCases/DeleteEvent";
import { GetOneEvent } from "./useCases/GetOneEvent";
import { ListEventAttendees } from "./useCases/ListEventAttendees";
import { ListEvents } from "./useCases/ListEvents";
import { UpdateEvent } from "./useCases/UpdateEvent";
import { GetEventsByType } from "./useCases/GetEventsByType";
import { GetEventsByTeam } from "./useCases/GetEventsByTeam";
import { ListEventsByYear } from "./useCases/listEventsByYear";

export {
  CheckinToEvent,
  CreateEvent,
  CreateEventFromBevyEventUseCase,
  DeleteEvent,
  GetOneEvent,
  ListEventAttendees,
  ListEvents,
  UpdateEvent,
  GetEventsByType,
  GetEventsByTeam,
};

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
import { FileStorageAdapter } from "./infrastructure/FileStorageAdapter";
import { filesModuleController } from "../filesModule";
import { ImportAndSyncAllToBevy } from "./useCases/ImportAndSyncAllToBevy";
import { SyncEventToBevy } from "./useCases/SyncEventToBevy";
import { AddEventImage } from "./useCases/AddEventImage";
import { DeleteEventImage } from "./useCases/DeleteEventImage";
import { ReorderEventImages } from "./useCases/ReorderEventImages";

// ============================================================================
// DEPENDENCY INJECTION & INITIALIZATION
// ============================================================================

const eventPointsServiceAdapter = new EventPointsService(pointSystemController);
const eventRepositoryAdapter = new EventRepository();
const attendanceRepositoryAdapter = new AttendanceRepository();
const bevyEventServiceAdapter = new BevyEventService(bevyEventController);
const filestorageAdapter = new FileStorageAdapter(filesModuleController);

// Initialize Use Cases
const checkinToEventUseCase = new CheckinToEvent(
  eventRepositoryAdapter,
  attendanceRepositoryAdapter,
  eventPointsServiceAdapter,
);
const createEventUseCase = new CreateEvent(
  eventRepositoryAdapter,
  filestorageAdapter,
);
const createEventFromBevyEventUseCase = new CreateEventFromBevyEventUseCase(
  eventRepositoryAdapter,
  bevyEventServiceAdapter,
);
const deleteEventUseCase = new DeleteEvent(
  eventRepositoryAdapter,
  filestorageAdapter,
);
const getOneEventUseCase = new GetOneEvent(eventRepositoryAdapter);
const listEventAttendeesUseCase = new ListEventAttendees(
  attendanceRepositoryAdapter,
);
const listEventsUseCase = new ListEvents(eventRepositoryAdapter);
const updateEventUseCase = new UpdateEvent(
  eventRepositoryAdapter,
  filestorageAdapter,
);
const listEventsByYearUseCase = new ListEventsByYear(eventRepositoryAdapter);
const getEventsByTypeUseCase = new GetEventsByType(eventRepositoryAdapter);
const getEventsByTeamUseCase = new GetEventsByTeam(eventRepositoryAdapter);
const addEventImageUseCase = new AddEventImage(
  eventRepositoryAdapter,
  filestorageAdapter,
);
const deleteEventImageUseCase = new DeleteEventImage(
  eventRepositoryAdapter,
  filestorageAdapter,
);
const reorderEventImagesUseCase = new ReorderEventImages(eventRepositoryAdapter);

const importandsyncuc = new ImportAndSyncAllToBevy(
  bevyEventServiceAdapter,
  eventRepositoryAdapter,
);
const syncevent = new SyncEventToBevy(
  eventRepositoryAdapter,
  bevyEventServiceAdapter,
);

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
  listEventsByYearUseCase,
  getEventsByTypeUseCase,
  getEventsByTeamUseCase,
  addEventImageUseCase,
  deleteEventImageUseCase,
  reorderEventImagesUseCase,
  importandsyncuc,
  syncevent,
);

export { EventSystemController };
