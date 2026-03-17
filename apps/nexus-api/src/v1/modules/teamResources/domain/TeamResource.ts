export type TeamResourceProps = {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  resourceType: string;
  thumbnailStorageReference: string;
  thumbnailPublicUrl: string;
  teamName: string; // linked to teams module
  createdAt: Date;
  updatedAt: Date;
};

export type TeamResourceInsertProps = Omit<TeamResourceProps, "id" | "createdAt" | "updatedAt">;
export type TeamResourceUpdateProps = Partial<TeamResourceInsertProps>;

export class TeamResource {
  private _props: TeamResourceProps;

  private constructor(props: TeamResourceProps) {
    this._props = props;
  }

  static create(props: TeamResourceInsertProps): TeamResource {
    const now = new Date();
    return new TeamResource({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static hydrate(props: TeamResourceProps): TeamResource {
    return new TeamResource(props);
  }

  get props(): TeamResourceProps {
    return this._props;
  }

  update(props: TeamResourceUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }
}
