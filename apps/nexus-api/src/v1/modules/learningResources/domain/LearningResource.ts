export type LearningResourceType = "studyJam" | "external" | "blog";

export type LearningResourceProps = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: LearningResourceType;
  tags: string[];
  teamId: string | null;
  eventId: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LearningResourceInsertProps = Omit<LearningResourceProps, "id" | "createdAt" | "updatedAt">;
export type LearningResourceUpdateProps = Partial<LearningResourceInsertProps>;

export class LearningResource {
  private _props: LearningResourceProps;

  private constructor(props: LearningResourceProps) {
    this._props = props;
  }

  static create(props: LearningResourceInsertProps): LearningResource {
    const now = new Date();
    return new LearningResource({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static hydrate(props: LearningResourceProps): LearningResource {
    return new LearningResource(props);
  }

  get props(): LearningResourceProps {
    return this._props;
  }

  update(props: LearningResourceUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }
}
