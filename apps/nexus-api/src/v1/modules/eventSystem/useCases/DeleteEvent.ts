import { IEventRepository } from "../domain/IEventRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { InternalServerError } from "@/v1/errors/HttpError";

export class DeleteEvent {
  constructor(
    private eventRepository: IEventRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(eventId: string): Promise<boolean> {
    const event = await this.eventRepository.findById(eventId);

    const imageUrls = new Set<string>(event.props.images);
    if (event.props.image_url) {
      imageUrls.add(event.props.image_url);
    }

    for (const imageUrl of imageUrls) {
      const deleted = await this.fileStorage.deleteFile(imageUrl);
      if (!deleted) {
        throw new InternalServerError(`Failed to delete event image from storage: ${imageUrl}`);
      }
    }

    await this.eventRepository.deleteEvent(eventId);
    return true;
  }
}
