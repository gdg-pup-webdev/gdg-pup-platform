export type AchievementProps = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  earnedAt: Date;
};

// Exclude properties that are auto-generated upon creation
export type AchievementInsertProps = Omit<AchievementProps, "id" | "earnedAt">;

// Exclude properties that should NEVER be updated after creation
export type AchievementUpdateProps = Partial<Omit<AchievementProps, "id" | "userId" | "earnedAt">>;

export class Achievement {
  _props: AchievementProps;

  constructor(props: AchievementProps) {
    this._props = props;
  }

  static create = (props: AchievementInsertProps) => {
    return new Achievement({
      ...props,
      id: crypto.randomUUID(), // Domain handles ID generation
      earnedAt: new Date(),    // Domain handles timestamping
    });
  };

  static hydrate = (props: AchievementProps) => {
    return new Achievement(props);
  };

  get props() {
    return this._props;
  }

  /**
   * Mutates the domain entity's internal state.
   * Only allows updating safe fields defined in AchievementUpdateProps.
   */
  update = (props: AchievementUpdateProps) => {
    this._props = { ...this._props, ...props };
  };
}