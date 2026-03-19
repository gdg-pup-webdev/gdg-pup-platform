import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";

export class GetBevyEvent {
  constructor(private readonly repository: IBevyEventRepository) {}

  async execute(id: string): Promise<BevyEvent | undefined> {
    return this.repository.findById(id);
  }
}
