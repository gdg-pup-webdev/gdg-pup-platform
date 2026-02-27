import { IEventRepository } from "../domain/IEventRepository";

export class DeleteEvent {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string): Promise<boolean> {
    await this.eventRepository.deleteEvent(eventId);
    return true;
  }
}
