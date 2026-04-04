

export type MemberProjectProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  mainImageUrl: string | null;
  secondaryImageUrl: string | null;
  tertiaryImageUrl: string | null;
  memberGdgId: string;
  createdAt: Date;
  updatedAt: Date;

  member: {
    gdgId: string; 
    name: string | null;
    thumbnailImageUrl: string | null; 
    email: string | null;
  } | null;
};

export type MemberProjectUpdateProps = Partial<Omit<MemberProjectProps, "id" | "createdAt" | "updatedAt" | "memberGdgId">>;

export class MemberProject {
  private constructor(private _props: MemberProjectProps) {}

  public get props(): MemberProjectProps {
    return { ...this._props };
  }

  public static create(props: Omit<MemberProjectProps, "id" | "createdAt" | "updatedAt" | "member">): MemberProject {
    const now = new Date();
    return new MemberProject({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      member: null,
    });
  }

  public static hydrate(props: MemberProjectProps): MemberProject {
    return new MemberProject(props);
  }

  public update(props: MemberProjectUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }
}
