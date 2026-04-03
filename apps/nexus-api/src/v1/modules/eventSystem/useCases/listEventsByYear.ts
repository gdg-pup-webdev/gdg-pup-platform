import { Event } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class ListEventsByYear {
  constructor(private eventRepository: IEventRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    year: number,
  ): Promise<{
    list: Event[];
    count: number;
  }> { 
    const result = await this.eventRepository.listEventsByYear(year, pageNumber, pageSize, );
    return result;
  }
}
