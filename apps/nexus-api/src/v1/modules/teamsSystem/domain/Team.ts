export type TeamProps = {
  id: string;
  name: string;
  description: string;
  responsibilities: string | null;
  parentTeamId: string | null;
};

export type TeamInsertProps = Omit<TeamProps, "id">;
export type TeamUpdateProps = Partial<TeamInsertProps>;

export class Team {
  private _props: TeamProps;

  constructor(props: TeamProps) {
    this._props = props;
  }

  static create(props: TeamInsertProps): Team {
    return new Team({
      ...props,
      id: crypto.randomUUID(),
    });
  }

  static hydrate(props: TeamProps): Team {
    return new Team(props);
  }

  get props(): TeamProps {
    return this._props;
  }

  update(props: TeamUpdateProps): void {
    this._props = { ...this._props, ...props };
  }
}
