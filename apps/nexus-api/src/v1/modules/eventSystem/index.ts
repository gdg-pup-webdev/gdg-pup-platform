// Use Cases
import { CheckinToEvent } from "./useCases/CheckinToEvent";
import { CreateEvent } from "./useCases/CreateEvent";
import { DeleteEvent } from "./useCases/DeleteEvent";
import { GetOneEvent } from "./useCases/GetOneEvent";
import { ListEventAttendees } from "./useCases/ListEventAttendees";
import { ListEvents } from "./useCases/ListEvents";
import { UpdateEvent } from "./useCases/UpdateEvent";

// Controller
import { EventSystemController } from "./EventSystemController";
import { EventPointsService } from "./infrastructure/EventPointsService";
import { AttendanceRepository } from "./infrastructure/AttendanceRepository";
import { EventRepository } from "./infrastructure/EventRepository";
import { pointSystemController } from "../pointsSystem";

// ============================================================================
// 2. DEPENDENCY INJECTION & INITIALIZATION
// ============================================================================

const eventPointsServiceAdapter = new EventPointsService(pointSystemController);
const eventRepositoryAdapter = new EventRepository();
const attendanceRepositoryAdapter = new AttendanceRepository();

// B. Initialize Use Cases (Application Layer)
// We inject the adapters into the business logic
const checkinToEventUseCase = new CheckinToEvent(
  eventRepositoryAdapter,
  attendanceRepositoryAdapter,
  eventPointsServiceAdapter,
);
const createEventUseCase = new CreateEvent(eventRepositoryAdapter);
const deleteEventUseCase = new DeleteEvent(eventRepositoryAdapter);
const getOneEventUseCase = new GetOneEvent(eventRepositoryAdapter);
const listEventAttendeesUseCase = new ListEventAttendees(
  attendanceRepositoryAdapter,
);
const listEventsUseCase = new ListEvents(eventRepositoryAdapter);
const updateEventUseCase = new UpdateEvent(eventRepositoryAdapter);

// C. Initialize Controller (Presentation/Interface Layer)
// We inject all the use cases into the primary controller
export const eventSystemController = new EventSystemController(
  checkinToEventUseCase,
  createEventUseCase,
  deleteEventUseCase,
  getOneEventUseCase,
  listEventAttendeesUseCase,
  listEventsUseCase,
  updateEventUseCase,
);
