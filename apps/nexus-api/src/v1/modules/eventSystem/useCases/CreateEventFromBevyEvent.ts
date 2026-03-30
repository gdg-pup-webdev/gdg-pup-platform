import { IEventRepository } from "../domain/IEventRepository";
import { IBevyEventService } from "../domain/IBevyEventService";
import { Event } from "../domain/Event";

export class CreateEventFromBevyEventUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly bevyEventService: IBevyEventService,
  ) {}

  async execute(bevyEventId: string, creatorId: string): Promise<Event> {
    const existingEvent = await this.eventRepository.findByBevyId(bevyEventId);

    if (existingEvent) {
      throw new Error("Event already exists for this bevy event id");
    }

    const bevyEvent = await this.bevyEventService.getById(bevyEventId);

    if (!bevyEvent) {
      throw new Error("Bevy Event not found");
    }

    const newEvent = Event.createFromBevyEvent(bevyEvent);

    await this.eventRepository.saveNew(newEvent);

    return newEvent;
  }
}
