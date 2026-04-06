import { Product, ProductInsertProps, ProductUpdateProps } from "./Product";

export interface IProductRepository {
  saveNew(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  list(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ products: Product[]; count: number }>;
  persistUpdates(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}
