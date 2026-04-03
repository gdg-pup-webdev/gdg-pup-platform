import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch } from "../domain/GdgMerch";

export class GetGdgMerch {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(id: string): Promise<GdgMerch | null> {
    return await this.repo.findById(id);
  }
}
