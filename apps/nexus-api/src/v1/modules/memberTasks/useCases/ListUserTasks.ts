import { ITaskRepository } from "../domain/ITaskRepository";
import { Task } from "../domain/Task";

export class ListUserTasks {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Task[]; count: number }> {
    if (pageNumber < 1) throw new Error("Page number must be greater than 0");
    if (pageSize < 1) throw new Error("Page size must be greater than 0");

    return this.taskRepository.findByUserId(userId, pageNumber, pageSize);
  }
}
