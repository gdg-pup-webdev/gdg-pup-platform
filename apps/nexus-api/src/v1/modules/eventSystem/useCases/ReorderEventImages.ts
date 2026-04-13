import { ValidationError } from "@/v1/errors/HttpError";
import { IEventRepository } from "../domain/IEventRepository";

export type ReorderEventImagesInput = {
  eventId: string;
  fromIndex: number;
  toIndex: number;
};

export class ReorderEventImages {
  constructor(private readonly repository: IEventRepository) {}

  async execute(input: ReorderEventImagesInput) {
    const event = await this.repository.findById(input.eventId);

    try {
      event.reorderImages(input.fromIndex, input.toIndex);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    return await this.repository.persistUpdates(event);
  }
}
