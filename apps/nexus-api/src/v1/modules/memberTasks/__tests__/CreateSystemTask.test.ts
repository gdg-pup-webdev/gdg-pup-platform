import { describe, it, expect, beforeEach } from "vitest";
import { MockTaskRepository } from "../infrastructure/MockTaskRepository";
import { CreateSystemTask } from "../useCases/CreateSystemTask";

let taskRepository: MockTaskRepository;
let createSystemTaskUseCase: CreateSystemTask;

const init = () => {
  taskRepository = new MockTaskRepository();
  createSystemTaskUseCase = new CreateSystemTask(taskRepository);
};

describe("CreateSystemTask Use Case", () => {
  beforeEach(init);

  const validInput = {
    userId: "user_001",
    name: "Complete your profile",
    description: "Fill in your bio and upload a profile picture",
    pointsOnCompletion: 100,
  };

  it("should create a task and return it with all correct properties", async () => {
    const result = await createSystemTaskUseCase.execute(validInput);

    expect(result.props.userId).toBe(validInput.userId);
    expect(result.props.name).toBe(validInput.name);
    expect(result.props.description).toBe(validInput.description);
    expect(result.props.pointsOnCompletion).toBe(validInput.pointsOnCompletion);
  });

  it("should initialize domain-managed fields correctly", async () => {
    const result = await createSystemTaskUseCase.execute(validInput);

    expect(result.props.id).toBeDefined();
    expect(typeof result.props.id).toBe("string");
    expect(result.props.isCompleted).toBe(false);
    expect(result.props.completedAt).toBeNull();
    expect(result.props.createdAt).toBeInstanceOf(Date);
    expect(result.props.updatedAt).toBeInstanceOf(Date);
  });

  it("should persist the new task in the repository", async () => {
    expect(taskRepository.tasks.length).toBe(0);

    const result = await createSystemTaskUseCase.execute(validInput);

    expect(taskRepository.tasks.length).toBe(1);
    expect(taskRepository.tasks[0].props.id).toBe(result.props.id);
  });

  it("should trim whitespace from name and description", async () => {
    const result = await createSystemTaskUseCase.execute({
      ...validInput,
      name: "  Complete profile  ",
      description: "  Add a bio  ",
    });

    expect(result.props.name).toBe("Complete profile");
    expect(result.props.description).toBe("Add a bio");
  });

  it("should throw if task name is empty", async () => {
    await expect(
      createSystemTaskUseCase.execute({ ...validInput, name: "   " }),
    ).rejects.toThrowError("Task name is required");
  });

  it("should throw if userId is empty", async () => {
    await expect(
      createSystemTaskUseCase.execute({ ...validInput, userId: "" }),
    ).rejects.toThrowError("User ID is required");
  });

  it("should throw if pointsOnCompletion is negative", async () => {
    await expect(
      createSystemTaskUseCase.execute({ ...validInput, pointsOnCompletion: -10 }),
    ).rejects.toThrowError("Points on completion cannot be negative");
  });

  it("should allow zero points on completion", async () => {
    const result = await createSystemTaskUseCase.execute({
      ...validInput,
      pointsOnCompletion: 0,
    });

    expect(result.props.pointsOnCompletion).toBe(0);
  });
});
