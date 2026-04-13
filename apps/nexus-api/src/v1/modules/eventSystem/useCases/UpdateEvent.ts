import { EventUpdateProps } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";
import { ValidationError } from "@/v1/errors/HttpError";

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

    const { image, images, image_url, ...props } = updateProps;

    try {
      if (images !== undefined) {
        currentEvent.update({ images });
      }

      // Apply scalar updates first.
      currentEvent.update({
        ...props,
        ...(image_url !== undefined ? { image_url } : {}),
      });

      // Handle new main image upload if provided.
      if (image) {
        const res = await this.filestorage.uploadFile(image);
        currentEvent.update({ image_url: res.publicUrl });
      }
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    const updatedEvent =
      await this.eventRepository.persistUpdates(currentEvent);
    return updatedEvent;
  }
}
