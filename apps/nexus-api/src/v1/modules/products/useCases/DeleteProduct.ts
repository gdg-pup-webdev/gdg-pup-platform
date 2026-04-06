import { IProductRepository } from "../domain/IProductRepository";

export class DeleteProduct {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
