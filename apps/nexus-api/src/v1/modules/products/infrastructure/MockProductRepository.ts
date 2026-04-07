import { IProductRepository } from "../domain/IProductRepository";
import { Product } from "../domain/Product";

export class MockProductRepository implements IProductRepository {
  public items: Map<string, Product> = new Map();

  async saveNew(product: Product): Promise<void> {
    this.items.set(product.props.id, Product.hydrate({ ...product.props }));
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.get(id);
    if (!product) return null;
    return Product.hydrate({ ...product.props });
  }

  async list(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ products: Product[]; count: number }> {
    const allProducts = Array.from(this.items.values()).map((item) =>
      Product.hydrate({ ...item.props }),
    );
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return {
      products: allProducts.slice(start, end),
      count: allProducts.length,
    };
  }

  async persistUpdates(product: Product): Promise<void> {
    this.items.set(product.props.id, Product.hydrate({ ...product.props }));
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
