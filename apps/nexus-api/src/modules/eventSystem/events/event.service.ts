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
import {
  InvalidOperationError,
  RepositoryError,
  ServiceError,
} from "@/classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

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
   * @throws {RepositoryError} If the repository operation fails.
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
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.listEvents(),
      "listing events",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Creates a new event.
   *
   * @returns A promise resolving to the created event.
   * @throws {RepositoryError} If the repository operation fails.
   */
  create = async (
    dto: models.eventSystem.event.insertDTO,
    creatorId: string,
  ) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.eventRepository.createEvent({
          ...dto,
          creator_id: creatorId,
        }),
      "creating event",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Retrieves an event by ID.
   *
   * @returns A promise resolving to the event data.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getById = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.getEventById(id),
      "getting service by id",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  /**
   * Deletes an event by ID.
   *
   * @returns A promise resolving to the deleted event data.
   * @throws {RepositoryError} If the repository operation fails.
   */
  delete = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.deleteEvent(id),
      "deleting service",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  /**
   * Updates an event by ID.
   *
   * @returns A promise resolving to the updated event data.
   * @throws {RepositoryError} If the repository operation fails.
   */
  update = async (id: string, dto: models.eventSystem.event.updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.updateEvent(id, dto),
      "updating event",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  /**
   * Checks a user into an event.
   * Handles attendance creation, event attendee count update, and point distribution.
   *
   * @returns A promise resolving to the attendance record, updated wallet, and updated event.
   * @throws {ServiceError} If any step of the process fails.
   */
  checkInToEvent = async (
    eventId: string,
    userId: string,
    checkinMethod: string,
  ) => {
    const { data: eventData, error } = await tryCatch(
      async () => await this.getById(eventId),
      "getting event details",
    );
    if (error) throw new ServiceError(error.message);

    // ensure the user hasn't already checked in
    const { data: existingAttendance, error: attendanceCheckError } =
      await tryCatch(
        async () =>
          await this.attendanceService.getAttendanceByEventAndUser(
            eventId,
            userId,
          ),
        "checking existing attendance",
      );
    if (attendanceCheckError)
      throw new ServiceError(attendanceCheckError.message);
    if (existingAttendance)
      throw new InvalidOperationError("User already checked in to this event");

    // create new attendance record
    const { data, error: attendanceError } = await tryCatch(
      async () =>
        await this.attendanceService.create(eventId, userId, checkinMethod),
      "creating attendance entry",
    );

    if (attendanceError) throw new ServiceError(attendanceError.message);

    const { data: updatedEventData, error: updateError } = await tryCatch(
      async () =>
        await this.update(eventId, {
          attendees_count: eventData.attendees_count + 1,
        }),
      "incrementing attendees of event",
    );

    if (updateError) throw new ServiceError(updateError.message);

    const { data: walletData, error: walletError } = await tryCatch(
      async () =>
        await this.walletService.incrementPoints(
          userId,
          eventData.attendance_points || 0,
          "event",
          eventId,
        ),
      "incrementing points of user",
    );
    if (walletError) throw new ServiceError(walletError.message);

    return { attendance: data, wallet: walletData, event: updatedEventData };
  };
}

export const eventServiceInstance = new EventService();
