import { SupabaseProductRepository } from "./infrastructure/SupabaseProductRepository";
import { ProductController } from "./ProductController";
import { CreateProduct } from "./useCases/CreateProduct";
import { DeleteProduct } from "./useCases/DeleteProduct";
import { GetProduct } from "./useCases/GetProduct";
import { ListProducts } from "./useCases/ListProducts";
import { UpdateProduct } from "./useCases/UpdateProduct";

const productRepository = new SupabaseProductRepository();

const createProductUseCase = new CreateProduct(productRepository);
const deleteProductUseCase = new DeleteProduct(productRepository);
const getProductUseCase = new GetProduct(productRepository);
const listProductsUseCase = new ListProducts(productRepository);
const updateProductUseCase = new UpdateProduct(productRepository);

export const productController = new ProductController(
  createProductUseCase,
  deleteProductUseCase,
  getProductUseCase,
  listProductsUseCase,
  updateProductUseCase,
);

export * from "./ProductController";
