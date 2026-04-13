import { Attendance } from "./Attendance";
import { BevyEventDTO } from "./IBevyEventService";

export const EVENT_MAX_IMAGES = 20;

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
  rsvp: number | null;
  bevy_event_id: string | null;
  image_url: string | null;
  images: string[];
  bevyPreviewUrl: string | null;

  short_description: string | null;
  bevy_attendees_count?: number;
  max_capacity: number;
  tags: string[];

  // New props
  speakers: string[];
  type: string | null;
  teamId: string | null;
  teamName?: string | null;
};

export type EventPrototypeProps = Omit<
  EventProps,
  "id" | "createdAt" | "updatedAt" | "attendees_count" | "rsvp" | "image_url" | "images"
> & {
  rsvp?: number | null;
  image_url?: string | null;
  images?: string[];
};

export type EventUpdateProps = Partial<EventPrototypeProps>;

export class Event {
  private constructor(private _props: EventProps) {}

  private static sanitizeImages(images: string[]): string[] {
    const sanitized = images
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    if (sanitized.length > EVENT_MAX_IMAGES) {
      throw new Error(`An event can only contain up to ${EVENT_MAX_IMAGES} images.`);
    }

    return sanitized;
  }

  private static assertImageIndex(index: number) {
    if (!Number.isInteger(index) || index < 0) {
      throw new Error("Image index must be a non-negative integer.");
    }
  }

  private static sanitizeMainImage(imageUrl: string | null | undefined): string | null {
    if (typeof imageUrl !== "string") {
      return null;
    }

    const trimmed = imageUrl.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  static hydrate(props: EventProps) {
    return new Event({
      ...props,
      image_url: Event.sanitizeMainImage(props.image_url),
      images: Event.sanitizeImages(props.images || []),
    });
  }

  get props() {
    return this._props;
  }

  static create(props: EventPrototypeProps) {
    const image_url = Event.sanitizeMainImage(props.image_url);
    const images = Event.sanitizeImages(props.images ?? []);

    return new Event({
      ...props,
      image_url,
      images,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      attendees_count: 0,
      rsvp: props.rsvp ?? null,
      bevy_event_id: props.bevy_event_id ?? null,
      type: props.type ?? null,
      teamId: props.teamId ?? null,
      speakers: props.speakers ?? [],
    });
  }

  static createFromBevyEvent(bevyEvent: BevyEventDTO) {
    const bevyImage = (bevyEvent.props.image_url || "").trim();

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
      image_url: bevyImage || null,
      images: [],

      // additional values
      attendance_points: 10, // Default points
      creatorId: null,
      rsvp: bevyEvent.props.total_attendees ?? null,
      // New props
      type: null,
      teamId: null,
      teamName: null,
      speakers: [],
    });
  }

  update(props: EventUpdateProps) {
    const nextMainImage = props.image_url !== undefined
      ? Event.sanitizeMainImage(props.image_url)
      : this._props.image_url;

    const nextImages = props.images
      ? Event.sanitizeImages(props.images)
      : this._props.images;

    this._props = {
      ...this._props,
      ...props,
      image_url: nextMainImage,
      images: nextImages,
      updatedAt: new Date(),
    };
  }

  addImage(imageUrl: string) {
    const sanitized = imageUrl.trim();
    if (!sanitized) {
      throw new Error("Image URL cannot be empty.");
    }

    if (this._props.images.length >= EVENT_MAX_IMAGES) {
      throw new Error(`An event can only contain up to ${EVENT_MAX_IMAGES} images.`);
    }

    this._props = {
      ...this._props,
      images: [...this._props.images, sanitized],
      updatedAt: new Date(),
    };
  }

  deleteImageAt(index: number): string {
    Event.assertImageIndex(index);

    const target = this._props.images[index];
    if (!target) {
      throw new Error(`Image at index ${index} does not exist.`);
    }

    const nextImages = [...this._props.images];
    nextImages.splice(index, 1);

    this._props = {
      ...this._props,
      images: nextImages,
      updatedAt: new Date(),
    };

    return target;
  }

  reorderImages(fromIndex: number, toIndex: number): void {
    Event.assertImageIndex(fromIndex);
    Event.assertImageIndex(toIndex);

    if (
      fromIndex >= this._props.images.length ||
      toIndex >= this._props.images.length
    ) {
      throw new Error("Image reorder indices are out of range.");
    }

    if (fromIndex === toIndex) {
      return;
    }

    const nextImages = [...this._props.images];
    const [movedImage] = nextImages.splice(fromIndex, 1);

    if (!movedImage) {
      throw new Error("Failed to reorder images.");
    }

    nextImages.splice(toIndex, 0, movedImage);

    this._props = {
      ...this._props,
      images: nextImages,
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
    const bevyImage = (bevyEvent.props.image_url || "").trim();

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
      image_url: bevyImage || this.props.image_url || null,
      images: this.props.images,

      bevy_attendees_count:
        bevyEvent.props.total_attendees || this.props.bevy_attendees_count || 0,
      rsvp: bevyEvent.props.total_attendees ?? this.props.rsvp ?? null,
    });
  }
}
