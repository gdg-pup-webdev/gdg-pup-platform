export type LearningResourceTeamSummary = {
  id: string;
  name: string;
  description: string;
};

export type LearningResourceEventSummary = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  venue: string | null;
};

export type LearningResourceProps = {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  teamId: string | null;
  eventId: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Included details
  team?: LearningResourceTeamSummary | null;
  event?: LearningResourceEventSummary | null;
};

export type LearningResourceInsertProps = Omit<LearningResourceProps, "id" | "createdAt" | "updatedAt" | "team" | "event">;
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
