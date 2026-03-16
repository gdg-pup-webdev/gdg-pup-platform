import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch, GdgMerchUpdateProps } from "../domain/GdgMerch";

export class UpdateGdgMerchInfo {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(id: string, updates: GdgMerchUpdateProps): Promise<GdgMerch> {
    const merch = await this.repo.findById(id);
    if (!merch) {
      throw new Error(`Cannot update: Merch with ID ${id} not found.`);
    }

    merch.updateInfo(updates);
    return await this.repo.persistUpdates(merch);
  }
}
