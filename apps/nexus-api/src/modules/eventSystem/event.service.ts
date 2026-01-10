import { Models } from "@packages/nexus-api-contracts";
import {
  EventRepository,
  eventRepositoryInstance,
} from "./event.repository.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "./attendance.service.js";
import {
  WalletService,
  walletServiceInstance,
} from "../economySystem/wallet.service.js";

export class EventService {
  constructor(
    private eventRepository: EventRepository = eventRepositoryInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance,
    private walletService: WalletService = walletServiceInstance
  ) {}

  list = async () => {
    const { data, error } = await this.eventRepository.listEvents();
    if (error) {
      return { error };
    }
    return { data };
  };

  create = async (
    dto: Omit<
      Models.eventSystem.event.insertDTO,
      "id" | "created_at" | "updated_at" | "creator_id"
    >,
    creatorId: string
  ) => {
    const { data, error } = await this.eventRepository.createEvent({
      ...dto,
      creator_id: creatorId,
    });
    if (error) {
      return { error };
    }
    return { data };
  };

  getById = async (id: string) => {
    const { data, error } = await this.eventRepository.getEventById(id);
    if (error) {
      return { error };
    }
    return { data };
  };

  delete = async (id: string) => {
    const { data, error } = await this.eventRepository.deleteEvent(id);
    if (error) {
      return { error };
    }
    return { data };
  };

  update = async (id: string, dto: Models.eventSystem.event.updateDTO) => {
    const { data, error } = await this.eventRepository.updateEvent(id, dto);
    if (error) {
      return { error };
    }
    return { data };
  };

  checkInToEvent = async (
    eventId: string,
    userId: string,
    checkinMethod: string
  ) => {
    // get the event details
    const { data: eventData, error: eventError } = await this.getById(eventId);
    if (eventError) {
      return { error: eventError };
    }
    if (!eventData) {
      return { error: { message: "Event not found" } };
    }

    // TODO: check if user has already checked in to this event

    // create new attendance record
    const { data, error } = await this.attendanceService.create(
      eventId,
      userId,
      checkinMethod
    );
    if (error) {
      return { error };
    }

    // increment points to user wallet if applicable
    const { data: walletData, error: walletError } =
      await this.walletService.incrementPoints(
        userId,
        eventData.attendance_points || 0,
        "event",
        eventId
      );
    if (walletError) {
      return { error: walletError };
    }

    return { data: { attendance: data, wallet: walletData } };
  };
}

export const eventServiceInstance = new EventService();
