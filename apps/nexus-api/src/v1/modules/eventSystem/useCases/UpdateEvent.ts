import { EventUpdateProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class UpdateEvent {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string, updateProps: EventUpdateProps) {
    /**
     * STEPS:
     * - load event
     * - update event
     * - persist updates
     * - return updated event
     */

    const currentEvent = await this.eventRepository.findById(eventId);
    currentEvent.update(updateProps);

    const updatedEvent =
      await this.eventRepository.persistUpdates(currentEvent);
    return updatedEvent;
  }
}
