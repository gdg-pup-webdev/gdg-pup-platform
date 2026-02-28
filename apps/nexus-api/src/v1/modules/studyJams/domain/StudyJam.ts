export type StudyJamProps = {
  id: string;
  creatorId: string;
  title: string;
  summary: string;
  description: string;
  createdAt: Date;
};

export type StudyJamInsertProps = Omit<StudyJamProps, "id" | "createdAt">;
export type StudyJamUpdateProps = Partial<Omit<StudyJamProps, "id" | "creatorId" | "createdAt">>;

export class StudyJam {
  private _props: StudyJamProps;

  constructor(props: StudyJamProps) {
    this._props = props;
  }

  static create(props: StudyJamInsertProps): StudyJam {
    return new StudyJam({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  static hydrate(props: StudyJamProps): StudyJam {
    return new StudyJam(props);
  }

  get props(): StudyJamProps {
    return this._props;
  }

  update(props: StudyJamUpdateProps): void {
    this._props = { ...this._props, ...props };
  }
}