import { Event } from "../domain/Event";
import { IBevyEventService } from "../domain/IBevyEventService";
import { IEventRepository } from "../domain/IEventRepository";

export class ImportAndSyncAllToBevy {
  constructor(
    private readonly bevyservice: IBevyEventService,
    private readonly eventrepo: IEventRepository,
  ) {}

  async execute() {
    let pageNumber = 1;
    const pageSize = 50; // Adjust as needed

    let success = 0;
    let fail = 0;

    const failures: { id: string; error: string }[] = [];

    while (true) {
      const result = await this.bevyservice.listEvents(pageNumber, pageSize);
      const totalPages = result.totalPages;

      for (const bevyEvent of result.list) {
        try {
          const existingEvent = await this.eventrepo.findByBevyId(
            bevyEvent.props.id,
          );
          if (existingEvent) {
            existingEvent.syncToBevyEvent(bevyEvent);
            await this.eventrepo.persistUpdates(existingEvent);
          } else {
            const newEvent = Event.createFromBevyEvent(bevyEvent);
            await this.eventrepo.saveNew(newEvent);
          }
          success++;
        } catch (error) {
          fail++;
          if (error instanceof Error) {
            failures.push({ id: bevyEvent.props.id, error: error.message });
          } else {
            failures.push({
              id: bevyEvent.props.id,
              error: "Unknown error" + (error as any).message || "",
            });
          }
        }
      }

      if (pageNumber >= totalPages) {
        break;
      }
      pageNumber++;
    }

    return {
      successCount: success,
      failCount: fail,
      failMessages: failures,
    };
  }
}
