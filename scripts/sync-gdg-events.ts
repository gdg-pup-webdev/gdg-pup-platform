import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Ensure required environment variables are present
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: Missing Supabase environment variables! Ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncEvents() {
  console.log("Starting GDG event synchronization...");

  try {
    const chapterId = 2926; // GDG PUP Chapter ID
    let allEvents: any[] = [];
    let url: string | null =
      `https://gdg.community.dev/api/chapter/${chapterId}/event`;

    while (url) {
      console.log(`Fetching from: ${url}`);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`GDG API Error: ${res.statusText}`);
      }

      const data: any = await res.json();

      if (data.results && data.results.length > 0) {
        allEvents = allEvents.concat(data.results);
      }

      // Handle Pagination
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

    console.log(
      `Successfully fetched ${allEvents.length} events from GDG Bevy API.`,
    );

    if (allEvents.length === 0) {
      console.log("No events to sync. Exiting.");
      return;
    }

    // Fetch details for each event to get the image URL
    console.log(
      "Fetching additional details (including images) for each event...",
    );
    const detailedEvents: any[] = [];
    for (const [index, event] of allEvents.entries()) {
      try {
        console.log(
          `Processing ${index + 1}/${allEvents.length}: ${event.title}`,
        );
        const detailRes = await fetch(
          `https://gdg.community.dev/api/event/${event.id}/`,
        );
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          // Merge detail data into the original event object
          detailedEvents.push({ ...event, ...detailData });
        } else {
          detailedEvents.push(event);
        }
      } catch (err) {
        console.warn(`Failed to fetch details for event ${event.id}`);
        detailedEvents.push(event);
      }
      // slight delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Format the data for Supabase scraped_gdg_events
    const formattedEvents = detailedEvents.map((event) => ({
      gdg_id: event.id,
      title: event.title,
      description_short: event.description_short,
      description: event.description || null,
      url: event.url,
      start_date: event.start_date,
      end_date: event.end_date,
      location:
        [
          event.venue_name,
          event.venue_address,
          event.venue_city,
          event.venue_state,
          event.venue_country,
          event.venue_zip_code,
        ]
          .filter(Boolean)
          .join(", ") ||
        event.city_route ||
        event.city ||
        "Online",
      // Prioritize cropped banner if available, otherwise fall back to picture or null
      cover_image_url:
        event.cropped_banner_url ||
        event.picture?.url ||
        event.cropped_picture_url ||
        null,
      status: event.status,
      event_type: event.event_type_title,
      event_type_slug: event.event_type_slug || null,
      tags: event.tags || [],
      total_attendees: event.total_attendees || 0,
      total_capacity: event.total_capacity || 0,
      attendee_virtual_venue_link: event.attendee_virtual_venue_link || null,
      video_url: event.video_url || null,
      is_virtual_event: event.audience_type
        ? event.audience_type !== "IN_PERSON"
        : event.is_virtual_event || false,
      last_scraped_at: new Date().toISOString(),
    }));

    // TESTING: Write to local JSON file instead of Supabase (Optional for logging)
    // console.log("Saving scraped events to test_events_output.json...");
    // fs.writeFileSync(
    //   "test_events_output.json",
    //   JSON.stringify(formattedEvents, null, 2),
    // );

    // Upsert into scraped_gdg_events
    console.log("Upserting records into Supabase...");
    const { error } = await supabase
      .from("scraped_gdg_events")
      .upsert(formattedEvents, { onConflict: "gdg_id" });

    if (error) {
      throw new Error(
        `Supabase Upsert Error: ${error.message} - ${error.details}`,
      );
    }

    console.log(
      `Sync completed successfully! Upserted ${formattedEvents.length} events.`,
    );
  } catch (error: any) {
    console.error("Failed to sync GDG events:", error.message);
    process.exit(1);
  }
}

syncEvents();
