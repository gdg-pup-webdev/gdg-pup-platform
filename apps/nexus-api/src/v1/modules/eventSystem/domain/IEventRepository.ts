import { Event } from "./Event";

export abstract class IEventRepository {
  abstract saveNewEvent(event: Event): Promise<Event>;

  abstract persistUpdates(event: Event): Promise<Event>;

  abstract deleteEvent(eventId: string): Promise<void>;

  abstract findById(eventId: string): Promise<Event>;

  abstract listEvents(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Event[]; count: number }>;

}
