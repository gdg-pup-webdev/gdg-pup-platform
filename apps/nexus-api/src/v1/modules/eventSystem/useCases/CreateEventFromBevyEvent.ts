import { IEventRepository } from "../domain/IEventRepository";
import { IBevyEventService } from "../domain/IBevyEventService";
import { Event } from "../domain/Event";

export class CreateEventFromBevyEventUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly bevyEventService: IBevyEventService
  ) {}

  async execute(bevyEventId: string, creatorId: string): Promise<Event> {
    const existingEvent = await this.eventRepository.findByBevyId(bevyEventId);

    if (existingEvent) {
      throw new Error("Event already exists for this bevy event id");
    }

    const bevyEvent = await this.bevyEventService.getById(bevyEventId);

    if (!bevyEvent) {
      throw new Error("Bevy Event not found");
    }

    const newEvent = Event.create({
      title: bevyEvent.props.title,
      description: bevyEvent.props.description || bevyEvent.props.short_description || "",
      category: bevyEvent.props.event_type || "No Category",
      venue: bevyEvent.props.location || "Online",
      start_date: new Date(bevyEvent.props.start_date),
      end_date: new Date(bevyEvent.props.end_date),
      bevy_event_id: bevyEvent.props.id,
      attendance_points: 10, // Default points
      creatorId: creatorId,
      image_url: null,
      bevyPreviewUrl: bevyEvent.props.url,
      short_description: bevyEvent.props.short_description || bevyEvent.props.description || "",
      tags: bevyEvent.props.tags || [],
      max_capacity: bevyEvent.props.max_capacity || 999999,
    });

    await this.eventRepository.saveNew(newEvent);

    return newEvent;
  }
}
