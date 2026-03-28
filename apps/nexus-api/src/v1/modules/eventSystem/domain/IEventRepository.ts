import { Event } from "./Event";

export interface EventFilters {
  type?: string;
  teamId?: string;
  category?: string;
}

export abstract class IEventRepository {
  abstract saveNew(event: Event): Promise<Event>;

  abstract persistUpdates(event: Event): Promise<Event>;

  abstract deleteEvent(eventId: string): Promise<void>;

  abstract findById(eventId: string): Promise<Event>;

  abstract findByBevyId(bevyEventId: string): Promise<Event | undefined>;

  abstract listEvents(
    pageNumber: number,
    pageSize: number,
    filters?: EventFilters
  ): Promise<{ list: Event[]; count: number }>;

  abstract listEventsByYear(
    pageNumber: number,
    pageSize: number,
    year: number,
  ): Promise<{ list: Event[]; count: number }>;

  abstract findByType(type: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }>;
  
  abstract findByTeamId(teamId: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }>;
}
