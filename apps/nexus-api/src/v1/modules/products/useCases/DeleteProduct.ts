import { IProductRepository } from "../domain/IProductRepository";
import { NotFoundError } from "@/v1/errors/HttpError";

export class DeleteProduct {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
