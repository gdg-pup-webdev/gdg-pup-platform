export type LearningResourceProps = {
  id: string;
  uploaderId: string;
  title: string;
  description: string;
  url: string;
  tagIds: string[];
  createdAt: Date;
};

export type LearningResourceInsertProps = Omit<LearningResourceProps, "id" | "createdAt" | "tagIds"> & { tagIds?: string[] };
export type LearningResourceUpdateProps = Partial<Omit<LearningResourceProps, "id" | "uploaderId" | "createdAt">>;

export class LearningResource {
  private _props: LearningResourceProps;

  constructor(props: LearningResourceProps) {
    this._props = props;
  }

  static create(props: LearningResourceInsertProps): LearningResource {
    return new LearningResource({
      ...props,
      id: crypto.randomUUID(),
      tagIds: props.tagIds || [],
      createdAt: new Date(),
    });
  }

  static hydrate(props: LearningResourceProps): LearningResource {
    return new LearningResource(props);
  }

  get props(): LearningResourceProps {
    return this._props;
  }

  update(props: LearningResourceUpdateProps): void {
    this._props = { ...this._props, ...props };
  }
}