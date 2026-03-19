export interface EventHighlight {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  content: string;
  image_url?: string | null;
  author_id: string;
  event_id: string;
}

export interface EventHighlightInsert {
  title: string;
  description: string;
  content: string;
  image_url?: string | null;
  author_id: string;
  event_id: string;
}

export interface EventHighlightUpdate extends Partial<EventHighlightInsert> {}
