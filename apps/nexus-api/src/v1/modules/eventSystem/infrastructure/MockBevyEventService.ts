import { IBevyEventService, BevyEventDTO } from "../domain/IBevyEventService";

export class MockBevyEventService implements IBevyEventService {
  public bevyEvents: BevyEventDTO[] = [];

  async getById(id: string): Promise<BevyEventDTO | undefined> {
    return this.bevyEvents.find((e) => e.id === id);
  }

  addBevyEvent(event: BevyEventDTO) {
    this.bevyEvents.push(event);
  }
}
