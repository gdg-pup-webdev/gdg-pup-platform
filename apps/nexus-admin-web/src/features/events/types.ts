import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// types inferred from contract models
export type Event = z.infer<typeof contract.api.v1.events.GET.response[200]>["data"][number];
export type EventAttendance = z.infer<typeof contract.api.v1.events.eventId.attendees.GET.response[200]>["data"][number];

export type EventInsert = {
  title: string;
  description: string;
  category: string;
  venue: string;
  start_date: string;
  end_date: string;
  attendance_points: number;
  image_url: string | null;
  image?: File;
  // New fields
  speakers: string[];
  type: string | null;
  teamId: string | null;
};

export type EventUpdate = Partial<EventInsert>;
