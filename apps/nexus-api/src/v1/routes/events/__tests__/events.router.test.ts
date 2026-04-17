import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventsHttpController } from "../events.controller";
import { EventsRouter } from "../events.router";
import { BadRequestError } from "@/v1/errors/HttpError";

vi.mock("@/v1/middlewares/rbac.middleware", () => ({
  requirePermissions: vi.fn(() => (req: any, res: any, next: any) => next()),
}));

describe("EventsRouter sync routes", () => {
  const syncEventToBevy = vi.fn();
  const importAndSyncAllToBevy = vi.fn();

  const syncedEventPayload = {
    id: crypto.randomUUID(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    creatorId: null,
    title: "GDG Event",
    description: "desc",
    category: "workshop",
    venue: "Main Hall",
    start_date: "2026-01-10T10:00:00.000Z",
    end_date: "2026-01-10T12:00:00.000Z",
    attendance_points: 10,
    attendees_count: 0,
    rsvp: 39,
    bevy_event_id: "12345",
    image_url: null,
    images: [],
    bevyPreviewUrl: null,
    short_description: null,
    max_capacity: 100,
    tags: [],
    speakers: [],
    type: null,
    teamId: null,
  };

  beforeEach(() => {
    syncEventToBevy.mockReset();
    importAndSyncAllToBevy.mockReset();
  });

  const createApp = () => {
    const moduleController = {
      syncEventToBevy,
      importAndSyncAllToBevy,
    } as unknown as EventsHttpController["eventController"];

    const controller = new EventsHttpController(moduleController);

    const app = express();
    app.use("/events", new EventsRouter(controller).router);
    return app;
  };

  it("POST /events/:eventId/syncToBevy returns synced event including rsvp", async () => {
    syncEventToBevy.mockResolvedValue(syncedEventPayload);

    const app = createApp();

    const response = await request(app)
      .post(`/events/${syncedEventPayload.id}/syncToBevy`)
      .expect(200);

    expect(syncEventToBevy).toHaveBeenCalledWith(syncedEventPayload.id);
    expect(response.body.status).toBe("success");
    expect(response.body.data.rsvp).toBe(39);
  });

  it("POST /events/:eventId/syncToBevy returns a 400 for unlinked events", async () => {
    syncEventToBevy.mockRejectedValue(
      new BadRequestError("Event is not linked to a bevy event"),
    );

    const app = createApp();
    const eventId = crypto.randomUUID();

    await request(app).post(`/events/${eventId}/syncToBevy`).expect(400);

    expect(syncEventToBevy).toHaveBeenCalledWith(eventId);
  });

  it("POST /events/syncAllToBevy returns sync summary", async () => {
    importAndSyncAllToBevy.mockResolvedValue({
      successCount: 2,
      failCount: 1,
      failMessages: [{ id: "222", error: "Bevy event not found" }],
    });

    const app = createApp();

    const response = await request(app)
      .post("/events/syncAllToBevy")
      .expect(200);

    expect(importAndSyncAllToBevy).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      status: "success",
      message: "Event synced successfully",
      data: {
        success: 2,
        fail: 1,
        failMessages: [{ id: "222", error: "Bevy event not found" }],
      },
    });
  });
});
