import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";

export class DeleteGdgMerch {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(id: string): Promise<void> {
    const merch = await this.repo.findById(id);
    if (!merch) {
      throw new Error(`Cannot delete: Merch with ID ${id} not found.`);
    }
    await this.repo.delete(id);
  }
}
