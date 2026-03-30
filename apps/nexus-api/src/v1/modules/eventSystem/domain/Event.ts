import { Attendance } from "./Attendance";
import { BevyEventDTO } from "./IBevyEventService";

export type EventProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  creatorId: string | null;

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
  bevyPreviewUrl: string | null;

  short_description: string | null;
  bevy_attendees_count?: number;
  max_capacity: number;
  tags: string[];

  // New props
  speakers: string[];
  type: string | null;
  teamId: string | null;
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
      type: props.type ?? null,
      teamId: props.teamId ?? null,
      speakers: props.speakers ?? [],
    });
  }

  static createFromBevyEvent(bevyEvent: BevyEventDTO) {
    return this.create({
      // matching values with bevy
      title: bevyEvent.props.title || "Untitled Event",
      description:
        bevyEvent.props.description || bevyEvent.props.short_description || "",
      category: bevyEvent.props.event_type || "",
      venue: bevyEvent.props.location || "",
      start_date: new Date(bevyEvent.props.start_date || ""),
      end_date: new Date(bevyEvent.props.end_date || ""),
      bevy_event_id: bevyEvent.props.id,
      bevyPreviewUrl: bevyEvent.props.url,
      short_description:
        bevyEvent.props.short_description || bevyEvent.props.description || "",
      tags: bevyEvent.props.tags || [],
      max_capacity: bevyEvent.props.max_capacity || 999999,
      image_url: bevyEvent.props.image_url || null,

      // additional values
      attendance_points: 10, // Default points
      creatorId: null,
      // New props
      type: null,
      teamId: null,
      speakers: [],
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

  syncToBevyEvent(bevyEvent: BevyEventDTO) {
    this.update({
      title: bevyEvent.props.title || this.props.title,
      description:
        bevyEvent.props.description ||
        bevyEvent.props.short_description ||
        this.props.description ||
        this.props.short_description ||
        "",
      category: bevyEvent.props.event_type || this.props.category,
      venue: bevyEvent.props.location || this.props.venue,
      start_date: new Date(bevyEvent.props.start_date || this.props.start_date),
      end_date: new Date(bevyEvent.props.end_date || this.props.end_date),
      bevy_event_id: bevyEvent.props.id,
      bevyPreviewUrl: bevyEvent.props.url,
      short_description:
        bevyEvent.props.short_description ||
        bevyEvent.props.description ||
        this.props.short_description ||
        this.props.description ||
        "",
      tags: bevyEvent.props.tags || this.props.tags || [],
      max_capacity:
        bevyEvent.props.max_capacity || this.props.max_capacity || 999999,
      image_url: bevyEvent.props.image_url || this.props.image_url || null,

      bevy_attendees_count:
        bevyEvent.props.total_attendees || this.props.bevy_attendees_count || 0,
    });
  }
}
