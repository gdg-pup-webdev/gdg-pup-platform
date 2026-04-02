import { ITaskRepository } from "../domain/ITaskRepository";
import { Task, TaskPrototypeProps } from "../domain/Task";

export type CreateSystemTaskInput = Omit<TaskPrototypeProps, "userId"> & {
  userId: string;
};

export class CreateSystemTask {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * Called by other modules to programmatically create and assign a task to a user.
   * This is a system-triggered action — it has no user-facing origin.
   */
  async execute(input: CreateSystemTaskInput): Promise<Task> {
    if (!input.name?.trim()) throw new Error("Task name is required");
    if (!input.userId?.trim()) throw new Error("User ID is required");
    if (input.pointsOnCompletion < 0) {
      throw new Error("Points on completion cannot be negative");
    }

    const newTask = Task.create({
      userId: input.userId,
      name: input.name.trim(),
      description: input.description?.trim() ?? "",
      pointsOnCompletion: input.pointsOnCompletion,
    });

    return this.taskRepository.saveNew(newTask);
  }
}
