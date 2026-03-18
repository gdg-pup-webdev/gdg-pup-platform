import { IBevyEventService, BevyEventDTO } from "../domain/IBevyEventService";
import { BevyEventController } from "@/v1/modules/bevyEvents/BevyEventController";

export class BevyEventService implements IBevyEventService {
  constructor(private readonly bevyEventController: BevyEventController) {}

  async getById(id: string): Promise<BevyEventDTO | undefined> {
    const bevyEvent = await this.bevyEventController.getById(id);

    if (!bevyEvent) {
      return undefined;
    }

    const props = bevyEvent.props;

    return {
      id: props.id,
      title: props.title,
      description: props.description,
      short_description: props.short_description,
      event_type: props.event_type,
      location: props.location,
      start_date: props.start_date,
      end_date: props.end_date,
    };
  }
}
