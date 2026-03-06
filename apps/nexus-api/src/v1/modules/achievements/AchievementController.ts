import { Achievement } from "./domain/Achievement";
import { CreateAchievementUseCase } from "./useCases/CreateAchievementUseCase";
import { GetAchievementUseCase } from "./useCases/GetAchievementUseCase";
import { ListAchievementsUseCase } from "./useCases/ListAchievementsUseCase";
import { UpdateAchievementUseCase } from "./useCases/UpdateAchievementUseCase";
import { DeleteAchievementUseCase } from "./useCases/DeleteAchievementUseCase";

// Simple DTO for the outside world
export interface AchievementResponseDTO {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
}

export class AchievementController {
  constructor(
    private readonly getUseCase: GetAchievementUseCase,
    private readonly listUseCase: ListAchievementsUseCase,
    private readonly createUseCase: CreateAchievementUseCase,
    private readonly updateUseCase: UpdateAchievementUseCase,
    private readonly deleteUseCase: DeleteAchievementUseCase
  ) {}

  private toDTO(achievement: Achievement): AchievementResponseDTO {
    const props = achievement.props;
    return {
      id: props.id,
      title: props.title,
      description: props.description,
      earnedAt: props.earnedAt.toISOString(),
    };
  }

  async getAchievement(id: string) {
    try {
      const achievement = await this.getUseCase.execute(id);
      return { status: "success", data: this.toDTO(achievement) };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async listAchievements(page: number, size: number, userId?: string) {
    try {
      const { list, count } = await this.listUseCase.execute({ userId, pageNumber: page, pageSize: size });
      return {
        status: "success",
        data: list.map((a) => this.toDTO(a)),
        meta: { totalRecords: count, page, size }
      };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async createAchievement(data: any) {
    try {
      // Input validation should happen here or via a schema validator (Zod/Joi) before calling use case
      const achievement = await this.createUseCase.execute({
        userId: data.user_id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url
      });
      return { status: "success", data: this.toDTO(achievement) };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async updateAchievement(id: string, data: any) {
    try {
      const achievement = await this.updateUseCase.execute({
        id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url
      });
      return { status: "success", data: this.toDTO(achievement) };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async deleteAchievement(id: string) {
    try {
      await this.deleteUseCase.execute({ id });
      return { status: "success", message: "Achievement deleted successfully" };
    } catch (err: any) {
      return { error: err.message };
    }
  }
}