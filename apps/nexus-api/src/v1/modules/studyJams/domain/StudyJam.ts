export type StudyJamProps = {
  id: string;
  creatorId: string;
  title: string;
  summary: string;
  description: string;
  createdAt: Date;
  recordingUrl?: string | null;
};

export type StudyJamUpdateProps = Partial<
  Pick<StudyJamProps, "title" | "summary" | "description" | "recordingUrl">
>;

export class StudyJam {
  private constructor(public readonly props: StudyJamProps) {}

  static create(
    props: Omit<StudyJamProps, "id" | "createdAt"> &
      Partial<Pick<StudyJamProps, "recordingUrl">>,
  ): StudyJam {
    return new StudyJam({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      recordingUrl: props.recordingUrl ?? null,
    });
  }

  static hydrate(props: StudyJamProps): StudyJam {
    return new StudyJam({
      ...props,
      recordingUrl: props.recordingUrl ?? null,
    });
  }

  update(props: StudyJamUpdateProps): void {
    this.props.title = props.title ?? this.props.title;
    this.props.summary = props.summary ?? this.props.summary;
    this.props.description = props.description ?? this.props.description;
    this.props.recordingUrl =
      props.recordingUrl ?? this.props.recordingUrl ?? null;
  }
}
