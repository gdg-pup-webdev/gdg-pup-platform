import { IBevyEventService } from "../domain/IBevyEventService";
import { IEventRepository } from "../domain/IEventRepository";

export class SyncEventToBevy {
  constructor(
    private readonly eventrepo: IEventRepository,
    private readonly bevyservice: IBevyEventService,
  ) {}

  async execute(eventId: string) {
    const event = await this.eventrepo.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (!event.props.bevy_event_id)
      throw new Error("Event is not linked to a bevy event");

    const bevyEvent = await this.bevyservice.getById(event.props.bevy_event_id);
    if (!bevyEvent) throw new Error("Bevy event not found");

    // Update the event with the latest data from Bevy
    event.syncToBevyEvent(bevyEvent);

    console.log("Syncing event to Bevy:", event.props, "->", bevyEvent.props);

    await this.eventrepo.persistUpdates(event);

    return event;
  }
}
