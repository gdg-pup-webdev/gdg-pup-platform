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
}