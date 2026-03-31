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
    } catch (e: any) {
      if (e.message && e.message.includes("not found")) {
        return false;
      }
      // If it's a different error (e.g. mapping error), rethrow it so we can see it in logs
      console.error(`[EventModuleAdapter] Unexpected error checking event existence for ID ${id}:`, e);
      throw e;
    }
  }
}
