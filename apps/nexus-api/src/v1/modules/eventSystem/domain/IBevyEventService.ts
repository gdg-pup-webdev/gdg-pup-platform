export class BevyEventDTO {
  constructor(
    public props: {
      id: string;
      title: string;
      description?: string;
      short_description?: string;
      event_type?: string;
      location?: string;
      start_date: string;
      end_date: string;
      url: string;
      tags: string[]; 
      max_capacity: number;
    },
  ) {}
}
export interface IBevyEventService {
  getById(id: string): Promise<BevyEventDTO | undefined>;
}
