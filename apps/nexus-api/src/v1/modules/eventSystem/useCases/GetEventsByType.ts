import { Event } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class GetEventsByType {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(type: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }> {
    return await this.eventRepository.findByType(type, pageNumber, pageSize);
  }
}
