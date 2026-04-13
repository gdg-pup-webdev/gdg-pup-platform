import { InternalServerError, ValidationError } from "@/v1/errors/HttpError";
import { IEventRepository } from "../domain/IEventRepository";
import { IFileStorage } from "../domain/IFileStorage";

export type DeleteEventImageInput = {
  eventId: string;
  imageIndex: number;
};

export class DeleteEventImage {
  constructor(
    private readonly repository: IEventRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(input: DeleteEventImageInput) {
    const event = await this.repository.findById(input.eventId);

    let imageUrl: string;
    try {
      imageUrl = event.deleteImageAt(input.imageIndex);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    const deleted = await this.fileStorage.deleteFile(imageUrl);
    if (!deleted) {
      throw new InternalServerError(`Failed to delete event image from storage: ${imageUrl}`);
    }

    return await this.repository.persistUpdates(event);
  }
}
