import { IBevyEventService, BevyEventDTO } from "../domain/IBevyEventService";
import { BevyEventController } from "@/v1/modules/bevyEvents/BevyEventController";

export class BevyEventService implements IBevyEventService {
  constructor(private readonly bevyEventController: BevyEventController) {}

  async getById(id: string): Promise<BevyEventDTO | undefined> {
    const bevyEvent = await this.bevyEventController.getById(id);

    if (!bevyEvent) {
      return undefined;
    }

    return {
      id: bevyEvent.id,
      title: bevyEvent.title,
      description: bevyEvent.description,
      short_description: bevyEvent.short_description,
      event_type: bevyEvent.event_type,
      location: bevyEvent.location,
      start_date: bevyEvent.start_date,
      end_date: bevyEvent.end_date,
    };
  }
}
