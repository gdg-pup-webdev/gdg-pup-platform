import { ITaskRepository } from "../domain/ITaskRepository";
import { Task, TaskUpdateProps } from "../domain/Task";

export class UpdateTask {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(taskId: string, dto: TaskUpdateProps): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    task.update(dto);

    return this.taskRepository.persistUpdates(task);
  }
}
