import { CreateGdgMerch } from "./useCases/CreateGdgMerch";
import { DeleteGdgMerch } from "./useCases/DeleteGdgMerch";
import { GetGdgMerch } from "./useCases/GetGdgMerch";
import { ListGdgMerch } from "./useCases/ListGdgMerch";
import { RedeemGdgMerch } from "./useCases/RedeemGdgMerch";
import { RestockGdgMerch } from "./useCases/RestockGdgMerch";
import { UpdateGdgMerchInfo } from "./useCases/UpdateGdgMerchInfo";

export class GdgMerchController {
  constructor(
    private readonly createGdgMerchUseCase: CreateGdgMerch,
    private readonly deleteGdgMerchUseCase: DeleteGdgMerch,
    private readonly getGdgMerchUseCase: GetGdgMerch,
    private readonly listGdgMerchUseCase: ListGdgMerch,
    private readonly redeemGdgMerchUseCase: RedeemGdgMerch,
    private readonly restockGdgMerchUseCase: RestockGdgMerch,
    private readonly updateGdgMerchInfoUseCase: UpdateGdgMerchInfo
  ) {}

  async list(pageNumber: number, pageSize: number) {
    const result = await this.listGdgMerchUseCase.execute(pageNumber, pageSize);
    return {
      list: result.list.map(merch => ({
        id: merch.props.id,
        name: merch.props.name,
        image: merch.props.image,
        points: merch.props.points,
        stock: merch.props.stock,
        createdAt: merch.props.createdAt.toISOString(),
        updatedAt: merch.props.updatedAt.toISOString(),
      })),
      count: result.count
    };
  }

  async getOne(id: string) {
    const merch = await this.getGdgMerchUseCase.execute(id);
    if (!merch) return null;
    return {
      id: merch.props.id,
      name: merch.props.name,
      image: merch.props.image,
      points: merch.props.points,
      stock: merch.props.stock,
      createdAt: merch.props.createdAt.toISOString(),
      updatedAt: merch.props.updatedAt.toISOString(),
    };
  }

  async create(name: string, image: string, points: number, stock: number) {
    const merch = await this.createGdgMerchUseCase.execute({ name, image, points, stock });
    return {
      id: merch.props.id,
      name: merch.props.name,
      image: merch.props.image,
      points: merch.props.points,
      stock: merch.props.stock,
      createdAt: merch.props.createdAt.toISOString(),
      updatedAt: merch.props.updatedAt.toISOString(),
    };
  }

  async updateInfo(id: string, name?: string, image?: string, points?: number) {
    const merch = await this.updateGdgMerchInfoUseCase.execute(id, { name, image, points });
    return {
      id: merch.props.id,
      name: merch.props.name,
      image: merch.props.image,
      points: merch.props.points,
      stock: merch.props.stock,
      createdAt: merch.props.createdAt.toISOString(),
      updatedAt: merch.props.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    await this.deleteGdgMerchUseCase.execute(id);
    return { success: true };
  }

  async redeem(userId: string, id: string) {
    const merch = await this.redeemGdgMerchUseCase.execute(userId, id);
    return {
      id: merch.props.id,
      name: merch.props.name,
      image: merch.props.image,
      points: merch.props.points,
      stock: merch.props.stock,
      createdAt: merch.props.createdAt.toISOString(),
      updatedAt: merch.props.updatedAt.toISOString(),
    };
  }

  async restock(id: string, amount: number) {
    const merch = await this.restockGdgMerchUseCase.execute(id, amount);
    return {
      id: merch.props.id,
      name: merch.props.name,
      image: merch.props.image,
      points: merch.props.points,
      stock: merch.props.stock,
      createdAt: merch.props.createdAt.toISOString(),
      updatedAt: merch.props.updatedAt.toISOString(),
    };
  }
}
