import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch, GdgMerchInsertProps } from "../domain/GdgMerch";

export class CreateGdgMerch {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(props: GdgMerchInsertProps): Promise<GdgMerch> {
    const merch = GdgMerch.create(props);
    return await this.repo.saveNew(merch);
  }
}
