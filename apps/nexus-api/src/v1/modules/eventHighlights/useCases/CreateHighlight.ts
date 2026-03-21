import { EventHighlight, EventHighlightInsertProps } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";
import { IUserService } from "../domain/IUserService";
import { IEventService } from "../domain/IEventService";
import { IEventHighlightStorage, EventHighlightFile } from "../domain/IEventHighlightStorage";

export type CreateHighlightInput = EventHighlightInsertProps & {
  thumbnailImage?: EventHighlightFile;
};

export class CreateHighlight {
  constructor(
    private readonly repo: IEventHighlightRepository,
    private readonly userService: IUserService,
    private readonly eventService: IEventService,
    private readonly storage: IEventHighlightStorage,
  ) {}

  async execute(input: CreateHighlightInput): Promise<EventHighlight> {
    const { thumbnailImage, ...props } = input;

    const userExists = await this.userService.exists(props.authorId);
    if (!userExists) {
      throw new Error("Author does not exist");
    }

    const eventExists = await this.eventService.exists(props.eventId);
    if (!eventExists) {
      throw new Error("Event does not exist");
    }

    let imageUrl = props.imageUrl;

    if (thumbnailImage) {
      const uploaded = await this.storage.uploadFile(thumbnailImage);
      imageUrl = uploaded.publicUrl;
    }

    const highlight = EventHighlight.create({
      ...props,
      imageUrl,
    });

    return await this.repo.saveNew(highlight);
  }
}
