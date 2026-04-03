import { RepositoryResultList } from "@/v1/types/repository.types";
import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch } from "../domain/GdgMerch";

export class MockGdgMerchRepository implements IGdgMerchRepository {
  private data: Map<string, GdgMerch> = new Map();

  async findById(id: string): Promise<GdgMerch | null> {
    const item = this.data.get(id);
    if (!item) return null;
    return GdgMerch.hydrate({ ...item.props });
  }

  async list(pageNumber: number, pageSize: number): RepositoryResultList<GdgMerch> {
    const arr = Array.from(this.data.values()).map(item => GdgMerch.hydrate({ ...item.props }));
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: arr.slice(start, end),
      count: arr.length
    };
  }

  async saveNew(merch: GdgMerch): Promise<GdgMerch> {
    this.data.set(merch.props.id, GdgMerch.hydrate({ ...merch.props }));
    return GdgMerch.hydrate({ ...merch.props });
  }

  async persistUpdates(merch: GdgMerch): Promise<GdgMerch> {
    this.data.set(merch.props.id, GdgMerch.hydrate({ ...merch.props }));
    return GdgMerch.hydrate({ ...merch.props });
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
}
