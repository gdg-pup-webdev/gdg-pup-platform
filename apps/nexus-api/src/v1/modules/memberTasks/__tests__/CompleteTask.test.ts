import { describe, it, expect, beforeEach } from "vitest";
import { MockTaskRepository } from "../infrastructure/MockTaskRepository";
import { MockTaskPointsService } from "../infrastructure/MockTaskPointsService";
import { CompleteTask } from "../useCases/CompleteTask";
import { Task } from "../domain/Task";

let taskRepository: MockTaskRepository;
let pointsService: MockTaskPointsService;
let completeTaskUseCase: CompleteTask;

const init = () => {
  taskRepository = new MockTaskRepository();
  pointsService = new MockTaskPointsService();
  completeTaskUseCase = new CompleteTask(taskRepository, pointsService);
};

const seedTask = (overrides: Partial<Parameters<typeof Task.hydrate>[0]> = {}) => {
  const task = Task.hydrate({
    id: "task_001",
    userId: "user_abc",
    name: "Attend first event",
    description: "Attend a GDG PUP event",
    pointsOnCompletion: 150,
    isCompleted: false,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
  taskRepository.tasks.push(task);
  return task;
};

describe("CompleteTask Use Case", () => {
  beforeEach(init);

  it("should mark the task as completed and award points", async () => {
    seedTask();

    const result = await completeTaskUseCase.execute("task_001");

    expect(result.task.props.isCompleted).toBe(true);
    expect(result.task.props.completedAt).toBeInstanceOf(Date);
    expect(result.newTotalPoints).toBe(150);
  });

  it("should persist the completed state in the repository", async () => {
    seedTask();

    await completeTaskUseCase.execute("task_001");

    const savedTask = await taskRepository.findById("task_001");
    expect(savedTask.props.isCompleted).toBe(true);
    expect(savedTask.props.completedAt).not.toBeNull();
  });

  it("should pass the correct userId, points, and taskId to the points service", async () => {
    seedTask({ pointsOnCompletion: 200 });

    const result = await completeTaskUseCase.execute("task_001");

    expect(pointsService.transactionLog.length).toBe(1);
    const log = pointsService.transactionLog[0];
    expect(log.userId).toBe("user_abc");
    expect(log.points).toBe(200);
    expect(log.taskId).toBe(result.task.props.id);
  });

  it("should accumulate points correctly across multiple task completions for the same user", async () => {
    const task1 = Task.hydrate({
      id: "task_101",
      userId: "user_abc",
      name: "Task A",
      description: "",
      pointsOnCompletion: 100,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const task2 = Task.hydrate({
      id: "task_102",
      userId: "user_abc",
      name: "Task B",
      description: "",
      pointsOnCompletion: 75,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    taskRepository.tasks.push(task1, task2);

    const result1 = await completeTaskUseCase.execute("task_101");
    const result2 = await completeTaskUseCase.execute("task_102");

    expect(result1.newTotalPoints).toBe(100);
    expect(result2.newTotalPoints).toBe(175);
  });

  it("should throw if the task ID does not exist", async () => {
    await expect(
      completeTaskUseCase.execute("non_existent_task"),
    ).rejects.toThrowError("Task not found");

    expect(pointsService.transactionLog.length).toBe(0);
  });

  it("should throw if the task is already completed", async () => {
    seedTask({ isCompleted: true, completedAt: new Date() });

    await expect(
      completeTaskUseCase.execute("task_001"),
    ).rejects.toThrowError("Task is already completed.");

    expect(pointsService.transactionLog.length).toBe(0);
  });
});
