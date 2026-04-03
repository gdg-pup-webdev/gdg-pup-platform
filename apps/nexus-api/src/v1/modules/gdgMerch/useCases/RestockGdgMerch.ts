import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch } from "../domain/GdgMerch";

export class RestockGdgMerch {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(id: string, amount: number): Promise<GdgMerch> {
    const merch = await this.repo.findById(id);
    if (!merch) {
      throw new Error(`Cannot restock: Merch with ID ${id} not found.`);
    }

    merch.restock(amount);
    return await this.repo.persistUpdates(merch);
  }
}
