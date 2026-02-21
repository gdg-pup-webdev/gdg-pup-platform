import { Attendance } from "./Attendance";

export type EventProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  title: string;
  description: string;
  category: string;
  venue: string;
  end_date: Date;
  start_date: Date;

  attendance_points: number;
  attendees_count: number;
};

export type EventPrototypeProps = Omit<
  EventProps,
  "id" | "createdAt" | "updatedAt" | "attendees_count"
>;

export type EventUpdateProps = Partial<EventPrototypeProps>;

export class Event {
  private _props: EventProps;

  constructor(props: EventProps) {
    this._props = props;
  }

  static hydrate(props: EventProps) {
    return new Event(props);
  }

  get props() {
    return this._props;
  }

  static create(props: EventPrototypeProps) {
    return new Event({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      attendees_count: 0,
    });
  }

  update = (props: EventUpdateProps) => {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  };

  addAttendance = (userId: string, method: string) {
    const newAttendance = new Attendance({
      userId,
      eventId: this._props.id,
      checkInMethod: method,
      checkedInAt: new Date(),
    })

    this._props.attendees_count += 1;

    return newAttendance;
  }
}
