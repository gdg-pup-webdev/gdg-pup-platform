import { IBevyScraperService } from "../domain/IBevyScraperService";
import { BevyEvent } from "../domain/BevyEvent";

export class BevyScraperService implements IBevyScraperService {
  private readonly chapterId = 2926; // GDG PUP Chapter ID

  async scrapeAll(): Promise<BevyEvent[]> {
    let allEvents: any[] = [];
    let url: string | null = `https://gdg.community.dev/api/chapter/${this.chapterId}/event`;

    while (url) {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GDG API Error: ${res.statusText}`);
      }

      const data: any = await res.json();
      if (data.results && data.results.length > 0) {
        allEvents = allEvents.concat(data.results);
      }

      if (data.links && data.links.next) {
        url = data.links.next.startsWith("/")
          ? `https://gdg.community.dev${data.links.next}`
          : data.links.next;
      } else if (data.pagination && data.pagination.next_page) {
        url = data.pagination.next_page;
      } else {
        url = null;
      }
    }

    const detailedEvents: BevyEvent[] = [];
    for (const event of allEvents) {
      try {
        const detailRes = await fetch(`https://gdg.community.dev/api/event/${event.id}/`);
        let detailData: any = {};
        if (detailRes.ok) {
          detailData = await detailRes.json();
        }
        
        const merged = { ...event, ...detailData };
        
        detailedEvents.push(BevyEvent.hydrate({
          id: merged.id.toString(),
          title: merged.title,
          short_description: merged.description_short,
          bevy_url: merged.url,
          start_date: merged.start_date,
          end_date: merged.end_date,
          location: this.formatLocation(merged),
          cover_image_url: merged.cropped_banner_url || merged.cropped_picture_url || undefined,
          image_square_url: merged.picture?.url || merged.event_type_logo?.url || undefined,
          status: merged.status,
          event_type: merged.event_type_title,
          description: merged.description,
          tags: merged.tags,
          attendees: merged.total_attendees,
          total_capacity: merged.total_capacity,
          attendee_virtual_venue_url: merged.attendee_virtual_venue_link,
          event_type_slug: merged.event_type_slug,
          video_url: merged.video_url,
          is_virtual_event: merged.audience_type ? merged.audience_type !== "IN_PERSON" : merged.is_virtual_event || false,
        }));

      } catch (err) {
        console.warn(`Failed to fetch details for event ${event.id}`);
        // Push with minimal data if details fail
        detailedEvents.push(BevyEvent.hydrate({
            id: event.id.toString(),
            title: event.title,
            start_date: event.start_date,
            end_date: event.end_date,
            bevy_url: event.url,
            short_description: event.description_short,
        }));
      }
      // slight delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    return detailedEvents;
  }

  private formatLocation(event: any): string {
    const locationParts = [
      event.venue_name,
      event.venue_address,
      event.venue_city,
      event.venue_state,
      event.venue_country,
      event.venue_zip_code,
    ].filter(Boolean);

    return locationParts.join(", ") || event.city_route || event.city || "Online";
  }
}
