import { ListBevyEvents } from "./useCases/ListBevyEvents";
import { GetBevyEvent } from "./useCases/GetBevyEvent";
import { BevyEvent, BevyEventProps } from "./domain/BevyEvent";
import { SyncBevyEvents } from "./useCases/SyncBevyEvents";

export type BevyEventDTO = BevyEventProps;

export class BevyEventController {
  constructor(
    private readonly listUseCase: ListBevyEvents,
    private readonly getBevyEventUseCase: GetBevyEvent,
    private readonly syncUseCase: SyncBevyEvents,
  ) {}

  private toDTO(bevyEvent: BevyEvent): BevyEventDTO {
    return { ...bevyEvent.props };
  }

  async list(pageNumber: number, pageSize: number) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize);
    
    return {
      list: list.map(event => this.toDTO(event)),
      count,
    };
  }

  async getById(id: string): Promise<BevyEventDTO | undefined> {
    const result = await this.getBevyEventUseCase.execute(id);
    return result ? this.toDTO(result) : undefined;
  }

  async sync(): Promise<number> {
    return await this.syncUseCase.execute();
  }
}
