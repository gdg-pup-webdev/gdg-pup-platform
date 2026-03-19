export type BevyEventDTO = {
  id: string;
  title: string;
  description?: string;
  short_description?: string;
  event_type?: string;
  location?: string;
  start_date: string;
  end_date: string;
};

export interface IBevyEventService {
  getById(id: string): Promise<BevyEventDTO | undefined>;
}
