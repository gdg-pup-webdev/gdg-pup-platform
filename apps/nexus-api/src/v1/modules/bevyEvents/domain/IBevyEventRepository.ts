import { BevyEvent } from "./BevyEvent";

export interface IBevyEventRepository {
  findAll(pageNumber: number, pageSize: number): Promise<{ list: BevyEvent[]; count: number }>;
}