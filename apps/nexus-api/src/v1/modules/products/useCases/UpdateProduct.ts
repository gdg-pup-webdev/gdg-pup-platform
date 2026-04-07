import { Product, ProductUpdateProps } from "../domain/Product";
import { IProductRepository } from "../domain/IProductRepository";
import { NotFoundError } from "@/v1/errors/HttpError";

export class UpdateProduct {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string, updateProps: ProductUpdateProps): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    product.update(updateProps);
    await this.repository.persistUpdates(product);
    return product;
  }
}
