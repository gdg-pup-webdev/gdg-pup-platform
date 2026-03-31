import { TaskUpdateProps } from "./domain/Task";
import { CreateSystemTaskInput } from "./useCases/CreateSystemTask";
import { CompleteTask } from "./useCases/CompleteTask";
import { CreateSystemTask } from "./useCases/CreateSystemTask";
import { GetTaskById } from "./useCases/GetTaskById";
import { ListUserTasks } from "./useCases/ListUserTasks";
import { UpdateTask } from "./useCases/UpdateTask";
import { TaskProps } from "./domain/Task";

export type TaskDTO = {
  id: string;
  userId: string;
  name: string;
  description: string;
  pointsOnCompletion: number;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export class TaskModuleController {
  constructor(
    private readonly listUserTasksUseCase: ListUserTasks,
    private readonly getTaskByIdUseCase: GetTaskById,
    private readonly createSystemTaskUseCase: CreateSystemTask,
    private readonly completeTaskUseCase: CompleteTask,
    private readonly updateTaskUseCase: UpdateTask,
  ) {}

  private toDTO(task: { props: TaskProps }): TaskDTO {
    const p = task.props;
    return {
      id: p.id,
      userId: p.userId,
      name: p.name,
      description: p.description,
      pointsOnCompletion: p.pointsOnCompletion,
      isCompleted: p.isCompleted,
      completedAt: p.completedAt ? p.completedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async listUserTasks(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: TaskDTO[]; count: number }> {
    const result = await this.listUserTasksUseCase.execute(
      userId,
      pageNumber,
      pageSize,
    );

    return {
      list: result.list.map((t) => this.toDTO(t)),
      count: result.count,
    };
  }

  async getTaskById(taskId: string): Promise<TaskDTO> {
    const result = await this.getTaskByIdUseCase.execute(taskId);
    return this.toDTO(result);
  }

  async createSystemTask(input: CreateSystemTaskInput): Promise<TaskDTO> {
    const result = await this.createSystemTaskUseCase.execute(input);
    return this.toDTO(result);
  }

  async completeTask(
    taskId: string,
  ): Promise<{ task: TaskDTO; newTotalPoints: number }> {
    const result = await this.completeTaskUseCase.execute(taskId);

    return {
      task: this.toDTO(result.task),
      newTotalPoints: result.newTotalPoints,
    };
  }

  async updateTask(taskId: string, dto: TaskUpdateProps): Promise<TaskDTO> {
    const result = await this.updateTaskUseCase.execute(taskId, dto);
    return this.toDTO(result);
  }
}
