import { Product } from "../domain/Product";
import { IProductRepository } from "../domain/IProductRepository";

export class GetProduct {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }
}
