import { describe, it, expect, beforeEach } from "vitest";
import { MockTaskRepository } from "../infrastructure/MockTaskRepository";
import { GetTaskById } from "../useCases/GetTaskById";
import { Task } from "../domain/Task";

let taskRepository: MockTaskRepository;
let getTaskByIdUseCase: GetTaskById;

const init = () => {
  taskRepository = new MockTaskRepository();
  getTaskByIdUseCase = new GetTaskById(taskRepository);
};

describe("GetTaskById Use Case", () => {
  beforeEach(init);

  it("should return the correct task when given a valid ID", async () => {
    const seededTask = Task.hydrate({
      id: "task_abc",
      userId: "user_001",
      name: "Write tests",
      description: "Write unit tests for the task module",
      pointsOnCompletion: 200,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    taskRepository.tasks.push(seededTask);

    const result = await getTaskByIdUseCase.execute("task_abc");

    expect(result.props.id).toBe("task_abc");
    expect(result.props.name).toBe("Write tests");
    expect(result.props.userId).toBe("user_001");
  });

  it("should throw an error when the task ID does not exist", async () => {
    await expect(
      getTaskByIdUseCase.execute("non_existent_id"),
    ).rejects.toThrowError("Task not found");
  });
});
