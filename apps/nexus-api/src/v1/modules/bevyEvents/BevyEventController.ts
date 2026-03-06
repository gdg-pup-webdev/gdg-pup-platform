import { ListBevyEvents } from "./useCases/ListBevyEvents";
import { BevyEvent, BevyEventProps } from "./domain/BevyEvent";

export type BevyEventDTO = BevyEventProps;

export class BevyEventController {
  constructor(
    private readonly listUseCase: ListBevyEvents
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
}