import { IEventRepository } from "../../domain/IEventRepository";
import { Event } from "../../domain/Event";

export class MockEventRepository implements IEventRepository {
  // In-memory data store
  public events: Event[] = [];

  async listEventsByYear(
    year: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<{ list: Event[]; count: number }> {
    // 1. Filter the in-memory array by the year
    const filteredEvents = this.events.filter((event) => {
      const eventYear = event.props.start_date.getFullYear();
      return eventYear === year;
    });

    // 2. Sort them to match the production behavior (ascending)
    filteredEvents.sort((a, b) => 
      a.props.start_date.getTime() - b.props.start_date.getTime()
    );

    // 3. Handle pagination
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize;
    const paginatedList = filteredEvents.slice(from, to);

    return {
      list: paginatedList,
      count: filteredEvents.length,
    };
  }

  async saveNew(event: Event): Promise<Event> {
    this.events.push(event);
    return event;
  }

  async persistUpdates(event: Event): Promise<Event> {
    const index = this.events.findIndex(e => e.props.id === event.props.id);
    
    if (index === -1) {
      throw new Error("Event not found");
    }

    this.events[index] = event;
    return event;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const initialLength = this.events.length;
    this.events = this.events.filter(e => e.props.id !== eventId);

    if (this.events.length === initialLength) {
      throw new Error("Event not found");
    }
  }

  async findById(eventId: string): Promise<Event> {
    const event = this.events.find(e => e.props.id === eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    return event;
  }

  async findByBevyId(bevyEventId: string): Promise<Event | undefined> {
    return this.events.find(e => e.props.bevy_event_id === bevyEventId);
  }

  async listEvents(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Event[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize;
    
    const paginatedList = this.events.slice(from, to);

    return {
      list: paginatedList,
      count: this.events.length,
    };
  }
}