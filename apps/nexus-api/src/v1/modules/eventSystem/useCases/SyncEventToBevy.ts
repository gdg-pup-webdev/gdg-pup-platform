import { IBevyEventService } from "../domain/IBevyEventService";
import { IEventRepository } from "../domain/IEventRepository";
import { BadRequestError, NotFoundError } from "@/v1/errors/HttpError";

export class SyncEventToBevy {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly bevyEventService: IBevyEventService,
  ) {}

  async execute(eventId: string) {
    const event = await this.eventRepository.findById(eventId);

    if (!event.props.bevy_event_id) {
      throw new BadRequestError("Event is not linked to a bevy event");
    }

    const bevyEvent = await this.bevyEventService.getById(
      event.props.bevy_event_id,
    );
    if (!bevyEvent) {
      throw new NotFoundError("Bevy event not found");
    }

    // Update the event with the latest data from Bevy
    event.syncToBevyEvent(bevyEvent);

    await this.eventRepository.persistUpdates(event);

    return event;
  }
}
