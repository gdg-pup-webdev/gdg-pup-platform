import { EventUpdateProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";

export class UpdateEvent {
  constructor(
    private eventRepository: IEventRepository,
    private readonly filestorage: IFileStorage,
  ) {}

  async execute(eventId: string, updateProps: EventUpdateProps & { image?: FileToUpload | null }) {
    const currentEvent = await this.eventRepository.findById(eventId);

    if (!currentEvent) {
      throw new Error("Event not found");
    }

    const { image, ...props } = updateProps;

    // Handle new image upload if provided
    if (image) {
      const res = await this.filestorage.uploadFile(image);
      props.image_url = res.publicUrl;
    }

    currentEvent.update(props);

    const updatedEvent =
      await this.eventRepository.persistUpdates(currentEvent);
    return updatedEvent;
  }
}
