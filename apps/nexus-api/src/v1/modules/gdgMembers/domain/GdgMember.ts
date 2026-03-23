export type GdgMemberProps = {
  id: string;
  gdgId: string;
  email: string;
  program: string;
  department: string;
  displayName: string;
  firstName: string;
  lastName: string;
  suffix: string | null;
};

export type GdgMemberInsertProps = GdgMemberProps; // create requires id as per prompt
export type GdgMemberUpdateProps = Partial<Omit<GdgMemberProps, "id">>;

export class GdgMember {
  private _props: GdgMemberProps;

  private constructor(props: GdgMemberProps) {
    this._props = props;
  }

  static create(props: GdgMemberInsertProps): GdgMember {
    if (!props.id) throw new Error("ID is required for creation");
    return new GdgMember(props);
  }

  static hydrate(props: GdgMemberProps): GdgMember {
    return new GdgMember(props);
  }

  get props(): GdgMemberProps {
    return this._props;
  }

  update(props: GdgMemberUpdateProps): void {
    this._props = { ...this._props, ...props };
  }
}
