import { Product } from "../domain/Product";
import { IProductRepository } from "../domain/IProductRepository";

export class ListProducts {
  constructor(private readonly repository: IProductRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Product[]; count: number }> {
    const result = await this.repository.list(pageNumber, pageSize);
    return {
      list: result.products,
      count: result.count,
    };
  }
}
