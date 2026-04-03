export type TaskProps = {
  id: string;
  userId: string;
  name: string;
  description: string;
  pointsOnCompletion: number;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskPrototypeProps = Omit<
  TaskProps,
  "id" | "isCompleted" | "completedAt" | "createdAt" | "updatedAt"
>;

export type TaskUpdateProps = Partial<
  Pick<TaskProps, "name" | "description" | "pointsOnCompletion">
>;

export class Task {
  private _props: TaskProps;

  private constructor(props: TaskProps) {
    this._props = props;
  }

  static create(props: TaskPrototypeProps): Task {
    return new Task({
      ...props,
      id: crypto.randomUUID(),
      isCompleted: false,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static hydrate(props: TaskProps): Task {
    return new Task(props);
  }

  get props(): TaskProps {
    return this._props;
  }

  update(props: TaskUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }

  markAsCompleted(): void {
    if (this._props.isCompleted) {
      throw new Error("Task is already completed.");
    }

    this._props = {
      ...this._props,
      isCompleted: true,
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
