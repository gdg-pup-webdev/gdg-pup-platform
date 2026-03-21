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
      title: bevyEvent.title,
      description: bevyEvent.description || bevyEvent.short_description || "",
      category: bevyEvent.event_type || "No Category",
      venue: bevyEvent.location || "Online",
      start_date: new Date(bevyEvent.start_date),
      end_date: new Date(bevyEvent.end_date),
      bevy_event_id: bevyEvent.id,
      attendance_points: 10, // Default points
      creatorId: creatorId,
      image_url: null,
    });

    await this.eventRepository.saveNew(newEvent);

    return newEvent;
  }
}
