export type MemberShowcaseProps = {
  id: string;
  thumbnailUrl: string;
  title: string;
  date: Date;
  description: string;
  articleUrl: string;
  showcasedMembers: string[]; // Array of member IDs
  createdAt: Date;
};

export type MemberShowcaseInsertProps = Omit<MemberShowcaseProps, "id" | "createdAt">;
export type MemberShowcaseUpdateProps = Partial<Omit<MemberShowcaseProps, "id" | "createdAt">>;

export class MemberShowcase {
  private _props: MemberShowcaseProps;

  private constructor(props: MemberShowcaseProps) {
    this._props = props;
  }

  static create(props: MemberShowcaseInsertProps): MemberShowcase {
    return new MemberShowcase({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  static hydrate(props: MemberShowcaseProps): MemberShowcase {
    return new MemberShowcase(props);
  }

  get props(): MemberShowcaseProps {
    return { ...this._props };
  }

  update(props: MemberShowcaseUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      showcasedMembers: props.showcasedMembers ? [...props.showcasedMembers] : this._props.showcasedMembers,
    };
  }
}
