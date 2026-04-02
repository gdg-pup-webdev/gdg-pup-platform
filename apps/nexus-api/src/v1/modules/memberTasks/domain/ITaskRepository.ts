import { Task } from "./Task";

export abstract class ITaskRepository {
  abstract saveNew(task: Task): Promise<Task>;

  abstract persistUpdates(task: Task): Promise<Task>;

  abstract findById(taskId: string): Promise<Task>;

  abstract findByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Task[]; count: number }>;
}
