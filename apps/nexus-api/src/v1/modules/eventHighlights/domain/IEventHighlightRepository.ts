import { EventHighlight } from "./EventHighlight";

export abstract class IEventHighlightRepository {
  abstract saveNew(highlight: EventHighlight): Promise<EventHighlight>;
  abstract persistUpdates(highlight: EventHighlight): Promise<EventHighlight>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<EventHighlight | undefined>;
  abstract list(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: EventHighlight[]; count: number }>;
}
