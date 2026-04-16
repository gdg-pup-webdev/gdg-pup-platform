import { Event, EVENT_MAX_IMAGES, EventPrototypeProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";
import { ValidationError } from "@/v1/errors/HttpError";

export class CreateEvent {
  constructor(
    private eventRepository: IEventRepository,
    private readonly filestorage: IFileStorage,
  ) {}

  async execute(
    eventPrototype: EventPrototypeProps,
    image : FileToUpload | null,
  ): Promise<Event> {
    let imageUrl = eventPrototype.image_url || null;
    const images = [...(eventPrototype.images ?? [])];
    
    if (image) {
      const res = await this.filestorage.uploadFile(image);
      imageUrl = res.publicUrl;
    }

    if (images.length > EVENT_MAX_IMAGES) {
      throw new ValidationError(`An event can only contain up to ${EVENT_MAX_IMAGES} images.`);
    }

    const newEvent = Event.create({
      ...eventPrototype,
      image_url: imageUrl,
      images,
    });

    const createdEvent = await this.eventRepository.saveNew(newEvent);

    return createdEvent;
  }
}
