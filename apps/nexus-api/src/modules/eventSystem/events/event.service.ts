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
  RepositoryError,
  ServerError,
  ServiceError,
} from "../../../classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class EventService {
  constructor(
    private eventRepository: EventRepository = eventRepositoryInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance,
    private walletService: WalletService = walletServiceInstance,
  ) {}

  list = async () => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.listEvents(),
      "listing events",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

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

  getById = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.getEventById(id),
      "getting service by id",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  delete = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.deleteEvent(id),
      "deleting service",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  update = async (id: string, dto: models.eventSystem.event.updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.eventRepository.updateEvent(id, dto),
      "updating event",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  checkInToEvent = async (
    eventId: string,
    userId: string,
    checkinMethod: string,
  ) => {
    // no need since di naman optional si userId sa params
    // if (!userId) {
    //   throw ServerError.internalError("User ID is required");
    // }

    // get the event details
    const { data: eventData, error } = await tryCatch(
      async () => await this.getById(eventId),
      "getting event details",
    );
    if (error) throw new ServiceError(error.message);

    // TODO: check if user has already checked in to this event

    // create new attendance record
    const { data, error: attendanceError } = await tryCatch(
      async () =>
        await this.attendanceService.create(eventId, userId, checkinMethod),
      "creating attendance entry",
    );

    if (attendanceError) throw new ServiceError(attendanceError.message);

    // increment attendees count in event record
    const { data: updatedEventData, error: updateError } = await tryCatch(
      async () =>
        await this.update(eventId, {
          attendees_count: eventData.attendees_count + 1,
        }),
      "incrementing attendees of event",
    );

    if (updateError) throw new ServiceError(updateError.message);

    // increment points to user wallet if applicable
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
