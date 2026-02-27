import { Event, EventPrototypeProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class CreateEvent {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventPrototype: EventPrototypeProps): Promise<Event> {
    const newEvent = Event.create(eventPrototype);

    const createdEvent = await this.eventRepository.saveNewEvent(newEvent);

    return createdEvent;
  }
}
