import { Event } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class GetOneEvent {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findById(eventId);
    return event;
  }
}
