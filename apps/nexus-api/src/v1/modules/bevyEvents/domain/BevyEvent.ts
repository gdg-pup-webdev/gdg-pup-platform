export type BevyEventProps = {
  id: string;
  title: string;
  short_description?: string;
  bevy_url?: string;
  start_date: string;
  end_date: string;
  location?: string;
  cover_image_url?: string;
  status?: string;
  event_type?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  tags?: string[];
  attendees?: number;
  total_capacity?: number;
  attendee_virtual_venue_url?: string;
  event_type_slug?: string;
  video_url?: string;
  is_virtual_event?: boolean;
};

export class BevyEvent {
  private _props: BevyEventProps;

  constructor(props: BevyEventProps) {
    this._props = props;
  }

  // Hydrate is used when loading existing data from the infrastructure layer
  static hydrate(props: BevyEventProps): BevyEvent {
    return new BevyEvent(props);
  }

  get props(): BevyEventProps {
    return this._props;
  }
}