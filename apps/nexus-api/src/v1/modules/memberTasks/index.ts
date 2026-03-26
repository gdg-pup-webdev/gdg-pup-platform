import { SupabaseTaskRepository } from "./infrastructure/SupabaseTaskRepository";
import { MockTaskPointsService } from "./infrastructure/MockTaskPointsService";
import { TaskModuleController } from "./TaskModuleController";
import { ListUserTasks } from "./useCases/ListUserTasks";
import { GetTaskById } from "./useCases/GetTaskById";
import { CreateSystemTask } from "./useCases/CreateSystemTask";
import { CompleteTask } from "./useCases/CompleteTask";
import { UpdateTask } from "./useCases/UpdateTask";

// ============================================================================
// INFRASTRUCTURE
// ============================================================================

const taskRepository = new SupabaseTaskRepository();

// TODO: Replace MockTaskPointsService with TaskPointsServiceAdapter once the
// pointsSystem switches to real Supabase repositories.
//
// import { TaskPointsServiceAdapter } from "./infrastructure/TaskPointsServiceAdapter";
// import { pointSystemController } from "../pointsSystem";
// const taskPointsService = new TaskPointsServiceAdapter(pointSystemController);
const taskPointsService = new MockTaskPointsService();

// ============================================================================
// USE CASES
// ============================================================================

const listUserTasksUseCase = new ListUserTasks(taskRepository);
const getTaskByIdUseCase = new GetTaskById(taskRepository);
const createSystemTaskUseCase = new CreateSystemTask(taskRepository);
const completeTaskUseCase = new CompleteTask(taskRepository, taskPointsService);
const updateTaskUseCase = new UpdateTask(taskRepository);

// ============================================================================
// CONTROLLER
// ============================================================================

export const taskModuleController = new TaskModuleController(
  listUserTasksUseCase,
  getTaskByIdUseCase,
  createSystemTaskUseCase,
  completeTaskUseCase,
  updateTaskUseCase,
);

export * from "./TaskModuleController";
