import { Event } from "../domain/Event";
import { IEventRepository, EventFilters } from "../domain/IEventRepository";

export class ListEvents {
  constructor(private eventRepository: IEventRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    filters?: EventFilters
  ): Promise<{ list: Event[]; count: number }> {
    return await this.eventRepository.listEvents(pageNumber, pageSize, filters);
  }
}
