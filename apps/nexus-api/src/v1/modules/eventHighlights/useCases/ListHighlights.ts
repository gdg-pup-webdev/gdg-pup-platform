import { EventHighlight } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";

export class ListHighlights {
  constructor(private readonly repo: IEventHighlightRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: EventHighlight[]; count: number }> {
    return await this.repo.list(pageNumber, pageSize, eventId);
  }
}
