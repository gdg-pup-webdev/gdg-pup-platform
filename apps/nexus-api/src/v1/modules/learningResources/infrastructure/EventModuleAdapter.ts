import { IEventModule } from "../domain/IEventModule";
import { EventSystemController } from "../../eventSystem/EventSystemController";

/**
 * Adapter that implements the IEventModule port using the EventSystemController.
 */
export class EventModuleAdapter implements IEventModule {
  constructor(private readonly eventController: EventSystemController) {}

  async existsById(id: string): Promise<boolean> {
    try {
      const event = await this.eventController.getOneEvent(id);
      return !!event;
    } catch (e) {
      return false;
    }
  }
}
