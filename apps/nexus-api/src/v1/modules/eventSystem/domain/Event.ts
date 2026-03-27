import { Attendance } from "./Attendance";

export type EventProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  creatorId: string;

  title: string;
  description: string;
  category: string;
  venue: string;
  start_date: Date;
  end_date: Date;

  attendance_points: number;
  attendees_count: number;
  bevy_event_id: string | null;
  image_url: string | null;
  bevyPreviewUrl : string | null;
};

export type EventPrototypeProps = Omit<
  EventProps,
  "id" | "createdAt" | "updatedAt" | "attendees_count"  
>;

export type EventUpdateProps = Partial<EventPrototypeProps>;

export class Event {
  private constructor(private _props: EventProps) {}

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
      bevy_event_id: props.bevy_event_id ?? null,
      image_url: props.image_url ?? null,
    });
  }

  update(props: EventUpdateProps) {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }

  addAttendance(userId: string, method: string) {
    const newAttendance = Attendance.create({
      userId: userId,
      eventId: this._props.id,
      checkInMethod: method,
    });

    this._props.attendees_count += 1;

    return newAttendance;
  }
}
