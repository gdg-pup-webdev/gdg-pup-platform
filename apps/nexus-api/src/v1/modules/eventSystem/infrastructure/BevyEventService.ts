import { IBevyEventService, BevyEventDTO } from "../domain/IBevyEventService";
import { BevyEventController } from "@/v1/modules/bevyEvents/BevyEventController";

export class BevyEventService implements IBevyEventService {
  constructor(private readonly bevyEventController: BevyEventController) {}

  async getById(id: string): Promise<BevyEventDTO | undefined> {
    const bevyEvent = await this.bevyEventController.getById(id);

    if (!bevyEvent) {
      return undefined;
    }

    return new BevyEventDTO({
      id: bevyEvent.id,
      title: bevyEvent.title,
      description: bevyEvent.description,
      short_description: bevyEvent.short_description,
      event_type: bevyEvent.event_type,
      location: bevyEvent.location,
      start_date: bevyEvent.start_date,
      end_date: bevyEvent.end_date,
      url: bevyEvent.bevy_url || "",
      tags: bevyEvent.tags || [],
      max_capacity: bevyEvent.total_capacity || 999999,
      total_attendees: bevyEvent.attendees || 0,  
      image_url: bevyEvent.cover_image_url || null,
    });
  }

  async listEvents(
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    list: BevyEventDTO[];
    totalEvents: number;
    totalPages: number;
  }> {
    const { list, count } = await this.bevyEventController.list(
      pageNumber,
      pageSize,
    );

    const mappedEvents = list.map((event) => {
      return new BevyEventDTO({
        id: event.id,
        title: event.title,
        description: event.description,
        short_description: event.short_description,
        event_type: event.event_type,
        location: event.location,
        start_date: event.start_date,
        end_date: event.end_date,
        url: event.bevy_url || "",
        tags: event.tags || [],
        max_capacity: event.total_capacity || 999999,
        image_url: event.cover_image_url || null,
        total_attendees: event.attendees || null,
      });
    });

    const totalPages = Math.ceil(count / pageSize);

    return { list: mappedEvents, totalEvents: count, totalPages };
  }
}
