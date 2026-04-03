import { RepositoryResultList } from "@/v1/types/repository.types";
import { GdgMerch } from "./GdgMerch";

export abstract class IGdgMerchRepository {
  abstract findById(id: string): Promise<GdgMerch | null>;
  abstract list(pageNumber: number, pageSize: number): RepositoryResultList<GdgMerch>;
  abstract saveNew(merch: GdgMerch): Promise<GdgMerch>;
  abstract persistUpdates(merch: GdgMerch): Promise<GdgMerch>;
  abstract delete(id: string): Promise<void>;
}
