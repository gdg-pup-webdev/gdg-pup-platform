import { describe, it, expect, beforeEach } from "vitest";
import { MockTaskRepository } from "../infrastructure/MockTaskRepository";
import { UpdateTask } from "../useCases/UpdateTask";
import { Task } from "../domain/Task";

let taskRepository: MockTaskRepository;
let updateTaskUseCase: UpdateTask;

const init = () => {
  taskRepository = new MockTaskRepository();
  updateTaskUseCase = new UpdateTask(taskRepository);
};

const seedTask = () => {
  const task = Task.hydrate({
    id: "task_001",
    userId: "user_abc",
    name: "Original Name",
    description: "Original description",
    pointsOnCompletion: 100,
    isCompleted: false,
    completedAt: null,
    createdAt: new Date("2026-01-01T10:00:00Z"),
    updatedAt: new Date("2026-01-01T10:00:00Z"),
  });
  taskRepository.tasks.push(task);
  return task;
};

describe("UpdateTask Use Case", () => {
  beforeEach(init);

  it("should update the task name", async () => {
    seedTask();

    const result = await updateTaskUseCase.execute("task_001", {
      name: "Updated Name",
    });

    expect(result.props.name).toBe("Updated Name");
    expect(result.props.description).toBe("Original description");
    expect(result.props.pointsOnCompletion).toBe(100);
  });

  it("should update description and points while keeping unchanged fields", async () => {
    seedTask();

    const result = await updateTaskUseCase.execute("task_001", {
      description: "New description",
      pointsOnCompletion: 250,
    });

    expect(result.props.description).toBe("New description");
    expect(result.props.pointsOnCompletion).toBe(250);
    expect(result.props.name).toBe("Original Name");
  });

  it("should update the updatedAt timestamp", async () => {
    seedTask();
    // Capture the value before the mutation happens — the entity reference is mutated in-place
    const originalUpdatedAt = new Date("2026-01-01T10:00:00Z");

    const result = await updateTaskUseCase.execute("task_001", {
      name: "Changed",
    });

    expect(result.props.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    );
  });

  it("should persist the updates in the repository", async () => {
    seedTask();

    await updateTaskUseCase.execute("task_001", { name: "Persisted Name" });

    const saved = await taskRepository.findById("task_001");
    expect(saved.props.name).toBe("Persisted Name");
  });

  it("should not change isCompleted or completedAt when updating task fields", async () => {
    seedTask();

    const result = await updateTaskUseCase.execute("task_001", {
      name: "New Name",
    });

    expect(result.props.isCompleted).toBe(false);
    expect(result.props.completedAt).toBeNull();
  });

  it("should throw if the task does not exist", async () => {
    await expect(
      updateTaskUseCase.execute("non_existent_id", { name: "X" }),
    ).rejects.toThrowError("Task not found");
  });
});
