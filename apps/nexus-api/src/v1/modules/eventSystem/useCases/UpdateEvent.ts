import { EventUpdateProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class UpdateEvent {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string, updateProps: EventUpdateProps) {
    const currentEvent = await this.eventRepository.findById(eventId);

    if (!currentEvent) {
      throw new Error("Event not found");
    }

    currentEvent.update(updateProps);

    const updatedEvent =
      await this.eventRepository.persistUpdates(currentEvent);
    return updatedEvent;
  }
}
