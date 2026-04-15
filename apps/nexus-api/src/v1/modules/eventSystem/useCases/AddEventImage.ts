import { ValidationError } from "@/v1/errors/HttpError";
import { EVENT_MAX_IMAGES } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";
import { FileToUpload, IFileStorage } from "../domain/IFileStorage";

export type AddEventImageInput = {
  eventId: string;
  image: FileToUpload;
};

export class AddEventImage {
  constructor(
    private readonly repository: IEventRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(input: AddEventImageInput) {
    const event = await this.repository.findById(input.eventId);

    if (event.props.images.length >= EVENT_MAX_IMAGES) {
      throw new ValidationError(`An event can only contain up to ${EVENT_MAX_IMAGES} images.`);
    }

    const uploaded = await this.fileStorage.uploadFile(input.image);

    try {
      event.addImage(uploaded.publicUrl);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    return await this.repository.persistUpdates(event);
  }
}
