import { IEventRepository } from "../domain/IEventRepository";
import { Event } from "../domain/Event";

export class MockEventRepository implements IEventRepository {
  // In-memory data store
  public events: Event[] = [];

  async saveNewEvent(event: Event): Promise<Event> {
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