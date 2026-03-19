export type EventHighlightProps = {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EventHighlightInsertProps = Omit<
  EventHighlightProps,
  "id" | "createdAt" | "updatedAt"
>;

export type EventHighlightUpdateProps = Partial<EventHighlightInsertProps>;

export class EventHighlight {
  private constructor(private _props: EventHighlightProps) {}

  static hydrate(props: EventHighlightProps) {
    return new EventHighlight(props);
  }

  static create(props: EventHighlightInsertProps) {
    return new EventHighlight({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get props() {
    return this._props;
  }

  update(props: EventHighlightUpdateProps) {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }
}
