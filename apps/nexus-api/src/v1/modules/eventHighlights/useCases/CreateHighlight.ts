import { EventHighlight, EventHighlightInsertProps } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";
import { IUserService } from "../domain/IUserService";
import { IEventService } from "../domain/IEventService";

export class CreateHighlight {
  constructor(
    private readonly repo: IEventHighlightRepository,
    private readonly userService: IUserService,
    private readonly eventService: IEventService,
  ) {}

  async execute(props: EventHighlightInsertProps): Promise<EventHighlight> {
    const userExists = await this.userService.exists(props.authorId);
    if (!userExists) {
      throw new Error("Author does not exist");
    }

    const eventExists = await this.eventService.exists(props.eventId);
    if (!eventExists) {
      throw new Error("Event does not exist");
    }

    const highlight = EventHighlight.create(props);
    return await this.repo.saveNew(highlight);
  }
}
