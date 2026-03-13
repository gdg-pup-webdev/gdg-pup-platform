import { ITaskRepository } from "../domain/ITaskRepository";
import { Task } from "../domain/Task";

export class MockTaskRepository implements ITaskRepository {
  public tasks: Task[] = [];

  async saveNew(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  async persistUpdates(task: Task): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.props.id === task.props.id);

    if (index === -1) {
      throw new Error("Task not found");
    }

    this.tasks[index] = task;
    return task;
  }

  async findById(taskId: string): Promise<Task> {
    const task = this.tasks.find((t) => t.props.id === taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async findByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Task[]; count: number }> {
    const userTasks = this.tasks.filter((t) => t.props.userId === userId);
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize;

    return {
      list: userTasks.slice(from, to),
      count: userTasks.length,
    };
  }
}
