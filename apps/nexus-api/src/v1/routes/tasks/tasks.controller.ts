import { TaskModuleController } from "@/v1/modules/tasksModule";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";
import { buildPaginationMeta } from "@/v1/utils/controller.utils";

export class TasksHttpController {
  constructor(private readonly taskModuleController: TaskModuleController) {}

  listTasks: RequestHandler = createExpressController(
    contract.api.v1.tasks.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const userId = input.query.user_id;

      if (!userId) {
        return output(400, {
          status: "error",
          message: "user_id query parameter is required",
        });
      }

      const { list, count } = await this.taskModuleController.listUserTasks(
        userId,
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Tasks fetched successfully",
        data: list.map((t) => ({
          id: t.id,
          user_id: t.userId,
          name: t.name,
          description: t.description,
          points_on_completion: t.pointsOnCompletion,
          is_completed: t.isCompleted,
          completed_at: t.completedAt,
          created_at: t.createdAt,
          updated_at: t.updatedAt,
        })),
        meta: buildPaginationMeta(count, pageNumber, pageSize),
      });
    },
  );

  createTask: RequestHandler = createExpressController(
    contract.api.v1.tasks.POST,
    async ({ input, output }) => {
      const { user_id, name, description, points_on_completion } =
        input.body.data;

      const result = await this.taskModuleController.createSystemTask({
        userId: user_id,
        name,
        description,
        pointsOnCompletion: points_on_completion,
      });

      return output(201, {
        status: "success",
        message: "Task created successfully",
        data: {
          id: result.id,
          user_id: result.userId,
          name: result.name,
          description: result.description,
          points_on_completion: result.pointsOnCompletion,
          is_completed: result.isCompleted,
          completed_at: result.completedAt,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    },
  );

  getTaskById: RequestHandler = createExpressController(
    contract.api.v1.tasks.taskId.GET,
    async ({ input, output }) => {
      const { taskId } = input.params;

      const result = await this.taskModuleController.getTaskById(taskId);

      return output(200, {
        status: "success",
        message: "Task fetched successfully",
        data: {
          id: result.id,
          user_id: result.userId,
          name: result.name,
          description: result.description,
          points_on_completion: result.pointsOnCompletion,
          is_completed: result.isCompleted,
          completed_at: result.completedAt,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    },
  );

  updateTask: RequestHandler = createExpressController(
    contract.api.v1.tasks.taskId.PATCH,
    async ({ input, output }) => {
      const { taskId } = input.params;
      const { name, description, points_on_completion } = input.body.data;

      const result = await this.taskModuleController.updateTask(taskId, {
        name,
        description,
        pointsOnCompletion: points_on_completion,
      });

      return output(200, {
        status: "success",
        message: "Task updated successfully",
        data: {
          id: result.id,
          user_id: result.userId,
          name: result.name,
          description: result.description,
          points_on_completion: result.pointsOnCompletion,
          is_completed: result.isCompleted,
          completed_at: result.completedAt,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    },
  );

  completeTask: RequestHandler = createExpressController(
    contract.api.v1.tasks.taskId.complete.POST,
    async ({ input, output }) => {
      const { taskId } = input.params;

      const result = await this.taskModuleController.completeTask(taskId);

      return output(200, {
        status: "success",
        message: "Task completed successfully",
        data: {
          task: {
            id: result.task.id,
            user_id: result.task.userId,
            name: result.task.name,
            description: result.task.description,
            points_on_completion: result.task.pointsOnCompletion,
            is_completed: result.task.isCompleted,
            completed_at: result.task.completedAt,
            created_at: result.task.createdAt,
            updated_at: result.task.updatedAt,
          },
          new_total_points: result.newTotalPoints,
        },
      });
    },
  );
}
