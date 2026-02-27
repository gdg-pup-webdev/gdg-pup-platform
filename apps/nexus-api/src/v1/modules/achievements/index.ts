import { AchievementController } from "./AchievementController";
import { SupabaseAchievementRepository } from "./infrastructure/SupabaseAchievementRepository";
import { CreateAchievementUseCase } from "./useCases/CreateAchievementUseCase";
import { GetAchievementUseCase } from "./useCases/GetAchievementUseCase";
import { ListAchievementsUseCase } from "./useCases/ListAchievementsUseCase";
import { UpdateAchievementUseCase } from "./useCases/UpdateAchievementUseCase";
import { DeleteAchievementUseCase } from "./useCases/DeleteAchievementUseCase";

// 1. Repo
const repo = new SupabaseAchievementRepository();

// 2. Use Cases
const getUC = new GetAchievementUseCase(repo);
const listUC = new ListAchievementsUseCase(repo);
const createUC = new CreateAchievementUseCase(repo);
const updateUC = new UpdateAchievementUseCase(repo);
const deleteUC = new DeleteAchievementUseCase(repo);

// 3. Controller
const achievementController = new AchievementController(
  getUC, 
  listUC, 
  createUC,
  updateUC,
  deleteUC
);

export { achievementController };