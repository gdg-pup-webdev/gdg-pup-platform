import { MockGdgMerchRepository } from "./infrastructure/MockGdgMerchRepository";
import { PointsSystemAdapter } from "./infrastructure/PointsSystemAdapter";
import { GdgMerchController } from "./GdgMerchController";
import { CreateGdgMerch } from "./useCases/CreateGdgMerch";
import { DeleteGdgMerch } from "./useCases/DeleteGdgMerch";
import { GetGdgMerch } from "./useCases/GetGdgMerch";
import { ListGdgMerch } from "./useCases/ListGdgMerch";
import { RedeemGdgMerch } from "./useCases/RedeemGdgMerch";
import { RestockGdgMerch } from "./useCases/RestockGdgMerch";
import { UpdateGdgMerchInfo } from "./useCases/UpdateGdgMerchInfo";

const gdgMerchRepository = new MockGdgMerchRepository();
const pointsSystemAdapter = new PointsSystemAdapter();

const createGdgMerchUseCase = new CreateGdgMerch(gdgMerchRepository);
const deleteGdgMerchUseCase = new DeleteGdgMerch(gdgMerchRepository);
const getGdgMerchUseCase = new GetGdgMerch(gdgMerchRepository);
const listGdgMerchUseCase = new ListGdgMerch(gdgMerchRepository);
const redeemGdgMerchUseCase = new RedeemGdgMerch(gdgMerchRepository, pointsSystemAdapter);
const restockGdgMerchUseCase = new RestockGdgMerch(gdgMerchRepository);
const updateGdgMerchInfoUseCase = new UpdateGdgMerchInfo(gdgMerchRepository);

export const gdgMerchController = new GdgMerchController(
  createGdgMerchUseCase,
  deleteGdgMerchUseCase,
  getGdgMerchUseCase,
  listGdgMerchUseCase,
  redeemGdgMerchUseCase,
  restockGdgMerchUseCase,
  updateGdgMerchInfoUseCase
);

export * from "./GdgMerchController";
