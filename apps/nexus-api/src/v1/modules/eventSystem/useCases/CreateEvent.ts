import { Event, EventPrototypeProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";

export class CreateEvent {
  constructor(
    private eventRepository: IEventRepository,
    private readonly filestorage: IFileStorage,
  ) {}

  async execute(
    eventPrototype: Omit<EventPrototypeProps, "image_url">,
    image?: FileToUpload,
  ): Promise<Event> {
    // uploading image
    let imageUrl: string | null = null;
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
