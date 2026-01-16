import { Models } from "@packages/nexus-api-contracts/models";
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
import { ServerError } from "../../classes/ServerError.js";

export class EventService {
  constructor(
    private eventRepository: EventRepository = eventRepositoryInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance,
    private walletService: WalletService = walletServiceInstance
  ) {}

  list = async () => {
    const { data, error } = await this.eventRepository.listEvents();

    // if (error instanceof somespecificerror) {
    //   // handle specific error
    //   throw new ServerError.internalError("specific message");
    // }

    if (error) {
      // handle unknown error
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
    return { data  };
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
    return { data  };
  };

  checkInToEvent = async (
    eventId: string,
    userId: string,
    checkinMethod: string
  ) => {
    // no need since di naman optional si userId sa params
    // if (!userId) {
    //   throw ServerError.internalError("User ID is required");
    // }

    // get the event details
    const { data: eventData, error } = await this.getById(eventId);
    if (error) {
      return { error };
    }
    if (!eventData) {
      throw ServerError.notFound("Event not found");
    }

    // TODO: check if user has already checked in to this event

    // create new attendance record
    const { data, error: attendanceError } = await this.attendanceService.create(
      eventId,
      userId,
      checkinMethod
    );

    if (attendanceError) {
      return { error: attendanceError };
    }


    // increment attendees count in event record
    const { data: updatedEventData, error: updateError } = await this.update(
      eventId,
      {
        attendees_count: eventData.attendees_count + 1,
      }
    );

    if (updateError) {
      return { error: updateError };
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

    return {
      data: { attendance: data, wallet: walletData, event: updatedEventData },
    };
  };
}

export const eventServiceInstance = new EventService();
