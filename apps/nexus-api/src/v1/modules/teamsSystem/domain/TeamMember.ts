export type TeamMemberProps = {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: Date;
};

export type TeamMemberInsertProps = Omit<TeamMemberProps, "id" | "joinedAt">;

export class TeamMember {
  private _props: TeamMemberProps;

  constructor(props: TeamMemberProps) {
    this._props = props;
  }

  static create(props: TeamMemberInsertProps): TeamMember {
    return new TeamMember({
      ...props,
      id: crypto.randomUUID(),
      joinedAt: new Date(),
    });
  }

  static hydrate(props: TeamMemberProps): TeamMember {
    return new TeamMember(props);
  }

  get props(): TeamMemberProps {
    return this._props;
  }
}