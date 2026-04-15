import { Product, ProductInsertProps } from "../domain/Product";
import { IProductRepository } from "../domain/IProductRepository";

export class CreateProduct {
  constructor(private readonly repository: IProductRepository) {}

  async execute(props: ProductInsertProps): Promise<Product> {
    const product = Product.create(props);
    await this.repository.saveNew(product);
    return product;
  }
}
