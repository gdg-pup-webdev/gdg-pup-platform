import { ListBevyEvents } from "./useCases/ListBevyEvents";
import { GetBevyEvent } from "./useCases/GetBevyEvent";
import { BevyEvent, BevyEventProps } from "./domain/BevyEvent";

export type BevyEventDTO = BevyEventProps;

export class BevyEventController {
  constructor(
    private readonly listUseCase: ListBevyEvents,
    private readonly getBevyEventUseCase: GetBevyEvent,
  ) {}

  private toDTO(bevyEvent: BevyEvent): BevyEventDTO {
    // Spread the props to return a plain data structure
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
}