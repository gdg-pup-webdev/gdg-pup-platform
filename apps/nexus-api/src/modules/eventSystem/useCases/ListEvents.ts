import { Event } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class ListEvents {
  constructor(private eventRepository: IEventRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    list: Event[];
    count: number;
  }> {
    const result = await this.eventRepository.listEvents(pageNumber, pageSize);
    return result;
  }
}
