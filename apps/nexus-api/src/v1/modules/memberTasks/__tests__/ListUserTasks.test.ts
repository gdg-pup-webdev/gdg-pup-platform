import { describe, it, expect, beforeEach } from "vitest";
import { MockTaskRepository } from "../infrastructure/MockTaskRepository";
import { ListUserTasks } from "../useCases/ListUserTasks";
import { Task } from "../domain/Task";

let taskRepository: MockTaskRepository;
let listUserTasksUseCase: ListUserTasks;

const init = () => {
  taskRepository = new MockTaskRepository();
  listUserTasksUseCase = new ListUserTasks(taskRepository);
};

const seedTasksForUser = (userId: string, count: number) => {
  for (let i = 1; i <= count; i++) {
    taskRepository.tasks.push(
      Task.hydrate({
        id: `task_${userId}_${i}`,
        userId,
        name: `Task ${i}`,
        description: `Description ${i}`,
        pointsOnCompletion: 50,
        isCompleted: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }
};

describe("ListUserTasks Use Case", () => {
  beforeEach(init);

  it("should return a paginated list and correct count for a user", async () => {
    seedTasksForUser("user_001", 5);

    const result = await listUserTasksUseCase.execute("user_001", 1, 2);

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(5);
    expect(result.list[0].props.id).toBe("task_user_001_1");
    expect(result.list[1].props.id).toBe("task_user_001_2");
  });

  it("should return the correct second page", async () => {
    seedTasksForUser("user_001", 5);

    const result = await listUserTasksUseCase.execute("user_001", 2, 2);

    expect(result.list).toHaveLength(2);
    expect(result.list[0].props.id).toBe("task_user_001_3");
    expect(result.list[1].props.id).toBe("task_user_001_4");
  });

  it("should only return tasks belonging to the requested user", async () => {
    seedTasksForUser("user_001", 3);
    seedTasksForUser("user_002", 5);

    const result = await listUserTasksUseCase.execute("user_001", 1, 10);

    expect(result.count).toBe(3);
    result.list.forEach((task) => {
      expect(task.props.userId).toBe("user_001");
    });
  });

  it("should return an empty list and count of 0 if user has no tasks", async () => {
    const result = await listUserTasksUseCase.execute("user_no_tasks", 1, 10);

    expect(result.list).toEqual([]);
    expect(result.count).toBe(0);
  });

  it("should return an empty list if the page is out of bounds", async () => {
    seedTasksForUser("user_001", 2);

    const result = await listUserTasksUseCase.execute("user_001", 5, 10);

    expect(result.list).toEqual([]);
    expect(result.count).toBe(2);
  });

  it("should throw if pageNumber is less than 1", async () => {
    await expect(
      listUserTasksUseCase.execute("user_001", 0, 10),
    ).rejects.toThrowError("Page number must be greater than 0");
  });

  it("should throw if pageSize is less than 1", async () => {
    await expect(
      listUserTasksUseCase.execute("user_001", 1, 0),
    ).rejects.toThrowError("Page size must be greater than 0");
  });
});
