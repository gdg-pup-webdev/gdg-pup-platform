import { ITaskRepository } from "../domain/ITaskRepository";
import { ITaskPointsService } from "../domain/ITaskPointsService";
import { Task } from "../domain/Task";

export type CompleteTaskResult = {
  task: Task;
  newTotalPoints: number;
};

export class CompleteTask {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly pointsService: ITaskPointsService,
  ) {}

  async execute(taskId: string): Promise<CompleteTaskResult> {
    // 1. Load the task — throws if not found
    const task = await this.taskRepository.findById(taskId);

    // 2. Apply completion on the domain entity — throws if already completed
    task.markAsCompleted();

    // 3. Persist the state change
    const updatedTask = await this.taskRepository.persistUpdates(task);

    // 4. Cross-domain: award points to the task's owner
    const newTotalPoints = await this.pointsService.awardTaskCompletionPoints(
      updatedTask.props.userId,
      updatedTask.props.pointsOnCompletion,
      updatedTask.props.id,
    );

    return {
      task: updatedTask,
      newTotalPoints,
    };
  }
}
