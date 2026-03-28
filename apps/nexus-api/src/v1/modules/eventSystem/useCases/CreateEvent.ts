import { Event, EventPrototypeProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";

export class CreateEvent {
  constructor(
    private eventRepository: IEventRepository,
    private readonly filestorage: IFileStorage,
  ) {}

  async execute(
    eventPrototype: EventPrototypeProps,
    image : FileToUpload | null,
  ): Promise<Event> {
    // uploading image if provided
    let imageUrl: string | null = eventPrototype.image_url;
    
    if (image) {
      const res = await this.filestorage.uploadFile(image);
      imageUrl = res.publicUrl;
    }

    const newEvent = Event.create({
      ...eventPrototype,
      image_url: imageUrl,
    });

    const createdEvent = await this.eventRepository.saveNew(newEvent);

    return createdEvent;
  }
}
