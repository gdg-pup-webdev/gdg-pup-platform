import { CreateProduct } from "./useCases/CreateProduct";
import { DeleteProduct } from "./useCases/DeleteProduct";
import { GetProduct } from "./useCases/GetProduct";
import { ListProducts } from "./useCases/ListProducts";
import { UpdateProduct } from "./useCases/UpdateProduct";
import { ProductUpdateProps } from "./domain/Product";

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProduct,
    private readonly deleteProductUseCase: DeleteProduct,
    private readonly getProductUseCase: GetProduct,
    private readonly listProductsUseCase: ListProducts,
    private readonly updateProductUseCase: UpdateProduct,
  ) {}

  async list(pageNumber: number, pageSize: number) {
    const result = await this.listProductsUseCase.execute(pageNumber, pageSize);
    return {
      list: result.list.map((product) => ({
        id: product.props.id,
        name: product.props.name,
        description: product.props.description,
        category: product.props.category,
        image: product.props.image,
        link: product.props.link,
        createdAt: product.props.createdAt.toISOString(),
        updatedAt: product.props.updatedAt.toISOString(),
      })),
      count: result.count,
    };
  }

  async getOne(id: string) {
    const product = await this.getProductUseCase.execute(id);
    if (!product) return null;
    return {
      id: product.props.id,
      name: product.props.name,
      description: product.props.description,
      category: product.props.category,
      image: product.props.image,
      link: product.props.link,
      createdAt: product.props.createdAt.toISOString(),
      updatedAt: product.props.updatedAt.toISOString(),
    };
  }

  async create(
    name: string,
    description: string,
    category: string,
    image: string,
    link?: string,
  ) {
    const product = await this.createProductUseCase.execute({
      name,
      description,
      category,
      image,
      link,
    });
    return {
      id: product.props.id,
      name: product.props.name,
      description: product.props.description,
      category: product.props.category,
      image: product.props.image,
      link: product.props.link,
      createdAt: product.props.createdAt.toISOString(),
      updatedAt: product.props.updatedAt.toISOString(),
    };
  }

  async update(id: string, updateProps: ProductUpdateProps) {
    const product = await this.updateProductUseCase.execute(id, updateProps);
    return {
      id: product.props.id,
      name: product.props.name,
      description: product.props.description,
      category: product.props.category,
      image: product.props.image,
      link: product.props.link,
      createdAt: product.props.createdAt.toISOString(),
      updatedAt: product.props.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    await this.deleteProductUseCase.execute(id);
    return { success: true };
  }
}
