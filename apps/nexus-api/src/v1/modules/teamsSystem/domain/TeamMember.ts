export type TeamMemberProps = {
  id: string;
  teamId: string;
  gdgId: string;
  role: string;
  joinedAt: Date;
  memberName: string | null;
  thumbnailImageUrl: string | null;
};

export type TeamMemberInsertProps = Omit<
  TeamMemberProps,
  "id" | "joinedAt" | "name" | "image"
>;

export type TeamMemberUpdateProps = Partial<Pick<TeamMemberProps, "role">>;

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
      memberName: null,
      thumbnailImageUrl: null,
    });
  }

  static hydrate(props: TeamMemberProps): TeamMember {
    return new TeamMember(props);
  }

  get props(): TeamMemberProps {
    return this._props;
  }

  update(props: TeamMemberUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
    };
  }
}