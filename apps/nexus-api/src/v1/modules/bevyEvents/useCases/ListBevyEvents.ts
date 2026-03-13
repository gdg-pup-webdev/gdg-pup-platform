import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";

export class ListBevyEvents {
  constructor(private readonly repo: IBevyEventRepository) {}

  async execute(pageNumber: number, pageSize: number): Promise<{ list: BevyEvent[]; count: number }> {
    if (pageNumber < 1) throw new Error("Page number must be greater than 0");
    if (pageSize < 1) throw new Error("Page size must be greater than 0");

    return await this.repo.findAll(pageNumber, pageSize);
  }
}