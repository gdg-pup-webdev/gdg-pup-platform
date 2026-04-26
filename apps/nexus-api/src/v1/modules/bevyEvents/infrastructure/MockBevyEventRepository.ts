import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";

export class MockBevyEventRepository implements IBevyEventRepository {
  public bevyEvents: BevyEvent[] = [];

  async findAll(pageNumber: number, pageSize: number): Promise<{ list: BevyEvent[]; count: number }> {
    // Basic pagination logic
    const from = (pageNumber - 1) * pageSize;
    const paginated = this.bevyEvents.slice(from, from + pageSize);

    return { 
      list: paginated, 
      count: this.bevyEvents.length 
    };
  }

  async findById(id: string): Promise<BevyEvent | undefined> {
    return this.bevyEvents.find((event) => event.props.id === id);
  }

  async upsertMany(events: BevyEvent[]): Promise<void> {
    events.forEach(newEvent => {
      const index = this.bevyEvents.findIndex(e => e.props.id === newEvent.props.id);
      if (index !== -1) {
        this.bevyEvents[index] = newEvent;
      } else {
        this.bevyEvents.push(newEvent);
      }
    });
  }
}
