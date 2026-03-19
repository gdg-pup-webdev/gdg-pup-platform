import { IEventService } from "../domain/IEventService";

export class MockEventService implements IEventService {
  public existingEventIds: string[] = [];

  async exists(eventId: string): Promise<boolean> {
    return this.existingEventIds.includes(eventId);
  }
}
