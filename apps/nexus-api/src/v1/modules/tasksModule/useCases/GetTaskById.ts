import { ITaskRepository } from "../domain/ITaskRepository";
import { Task } from "../domain/Task";

export class GetTaskById {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) throw new Error("Task not found");

    return task;
  }
}
