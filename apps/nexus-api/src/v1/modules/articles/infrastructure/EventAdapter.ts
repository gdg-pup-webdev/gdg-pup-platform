import { IEventService } from "../domain/IEventService";
import { EventSystemController } from "../../eventSystem/EventSystemController";

export class EventAdapter implements IEventService {
  constructor(private readonly eventController: EventSystemController) {}

  async exists(eventId: string): Promise<boolean> {
    try {
      const event = await this.eventController.getOneEvent(eventId);
      return !!event;
    } catch (error) {
      return false;
    }
  }
}
