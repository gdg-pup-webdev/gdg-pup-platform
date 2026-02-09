import { models } from "@packages/nexus-api-contracts";
import {
  EventRepository,
  eventRepositoryInstance,
} from "./event.repository.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "../attendance/attendance.service.js";
import {
  WalletService,
  walletServiceInstance,
} from "@/modules/economySystem/wallets/wallet.service.js";

/**
 * Service for managing event business logic.
 * Orchestrates event creation, updates, deletion, and check-ins.
 */
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository = eventRepositoryInstance,
    private readonly attendanceService: AttendanceService = attendanceServiceInstance,
    private readonly walletService: WalletService = walletServiceInstance,
  ) {}

  /**
   * Lists events based on provided filters.
   *
   * @returns A promise resolving to the list of events and count.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      creator_id?: string;
      category?: string;
      venue?: string;
      start_date_gte?: string;
      start_date_lte?: string;
      end_date_gte?: string;
      end_date_lte?: string;
    },
  ) => {
    return await this.eventRepository.listEvents(pageNumber, pageSize, filters);
  };

  /**
   * Creates a new event.
   *
   * @returns A promise resolving to the created event.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  create = async (
    dto: models.eventSystem.event.insertDTO,
    creatorId: string,
  ) => {
    return await this.eventRepository.createEvent({
      ...dto,
      creator_id: creatorId,
    });
  };

  /**
   * Retrieves an event by ID.
   *
   * @returns A promise resolving to the event data.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  getById = async (id: string) => {
    return await this.eventRepository.getEventById(id);
  };

  /**
   * Deletes an event by ID.
   *
   * @returns A promise resolving to the deleted event data.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  delete = async (id: string) => {
    return await this.eventRepository.deleteEvent(id);
  };

  /**
   * Updates an event by ID.
   *
   * @returns A promise resolving to the updated event data.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  update = async (id: string, dto: models.eventSystem.event.updateDTO) => {
    return await this.eventRepository.updateEvent(id, dto);
  };

  /**
   * Checks a user into an event.
   * Handles attendance creation, event attendee count update, and point distribution.
   *
   * @returns A promise resolving to the attendance record, updated wallet, and updated event.
   * @throws {ServiceError_DEPRECATED} If any step of the process fails.
   */
  checkInToEvent = async (
    eventId: string,
    userId: string,
    checkinMethod: string,
  ) => {
    const eventData = await this.getById(eventId);

    // create new attendance record
    const newAttendance = await this.attendanceService.create(
      eventId,
      userId,
      checkinMethod,
    );

    const updatedEventData = await this.update(eventId, {
      attendees_count: eventData.attendees_count + 1,
    });

    const walletData = await this.walletService.incrementPoints(
      userId,
      eventData.attendance_points || 0,
      "event",
      eventId,
    );

    return {
      attendance: newAttendance,
      wallet: walletData,
      event: updatedEventData,
    };
  };
}

export const eventServiceInstance = new EventService();
