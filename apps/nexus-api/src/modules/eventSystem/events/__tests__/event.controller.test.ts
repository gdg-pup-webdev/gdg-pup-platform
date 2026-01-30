/**
 * @file event.controller.test.ts
 * @description Contract-aware HTTP integration tests for event routes using
 * supertest(app) with mocked auth and service layers. These tests validate
 * routing and response shape without touching the database.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest = require("supertest");

const {
  mockListEvents,
  mockCreateEvent,
  mockGetById,
  mockUpdateEvent,
  mockDeleteEvent,
  mockCheckInToEvent,
  mockListEventAttendees,
} = vi.hoisted(() => ({
  mockListEvents: vi.fn(),
  mockCreateEvent: vi.fn(),
  mockGetById: vi.fn(),
  mockUpdateEvent: vi.fn(),
  mockDeleteEvent: vi.fn(),
  mockCheckInToEvent: vi.fn(),
  mockListEventAttendees: vi.fn(),
}));

vi.mock("@/middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth: () => (req: any, _res: any, next: any) => {
      req.user = { id: "user-1", email: "user@example.com" };
      next();
    },
  },
  AuthMiddleware: class {},
}));

vi.mock("../event.service.js", () => ({
  eventServiceInstance: {
    list: (...args: any[]) => mockListEvents(...args),
    create: (...args: any[]) => mockCreateEvent(...args),
    getById: (...args: any[]) => mockGetById(...args),
    update: (...args: any[]) => mockUpdateEvent(...args),
    delete: (...args: any[]) => mockDeleteEvent(...args),
    checkInToEvent: (...args: any[]) => mockCheckInToEvent(...args),
  },
  EventService: class {},
}));

vi.mock("../../attendance/attendance.service.js", () => ({
  attendanceServiceInstance: {
    listEventAttendees: (...args: any[]) => mockListEventAttendees(...args),
  },
  AttendanceService: class {},
}));

import app from "../../../../app.js";
import { testListEndpoint } from "../../__tests__/test-helpers.js";

describe("EventController integration", () => {
  const event = {
    id: "event-1",
    title: "Test Event",
    attendance_points: 10,
    attendees_count: 0,
    category: null,
    created_at: new Date().toISOString(),
    creator_id: "user-1",
    description: null,
    end_date: null,
    start_date: null,
    updated_at: new Date().toISOString(),
    venue: null,
  };
  const attendee = {
    id: "user-2",
    avatar_url: null,
    created_at: new Date().toISOString(),
    display_name: "User Two",
    email: "user2@example.com",
    first_name: null,
    gdg_id: "gdg-2",
    last_name: null,
    status: "active",
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/event-system/events lists events", async () => {
    await testListEndpoint(app, "/api/event-system/events", mockListEvents, event);
    expect(mockListEvents).toHaveBeenCalled();
  });

  it("POST /api/event-system/events creates an event with user id", async () => {
    mockCreateEvent.mockResolvedValue(event);

    const response = await supertest(app)
      .post("/api/event-system/events")
      .send({
        data: {
          title: "Test Event",
          attendance_points: 10,
          category: null,
          description: null,
          start_date: null,
          end_date: null,
          venue: null,
        },
      });

    expect(response.status).toBe(200);
    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Test Event" }),
      "user-1",
    );
  });

  it("GET /api/event-system/events/:eventId fetches an event", async () => {
    mockGetById.mockResolvedValue(event);

    const response = await supertest(app).get("/api/event-system/events/event-1");

    expect(response.status).toBe(200);
    expect(mockGetById).toHaveBeenCalledWith("event-1");
  });

  it("PATCH /api/event-system/events/:eventId updates an event", async () => {
    mockUpdateEvent.mockResolvedValue({ ...event, title: "Updated" });

    const response = await supertest(app)
      .patch("/api/event-system/events/event-1")
      .send({ data: { title: "Updated" } });

    expect(response.status).toBe(200);
    expect(mockUpdateEvent).toHaveBeenCalledWith(
      "event-1",
      expect.objectContaining({ title: "Updated" }),
    );
  });

  it("DELETE /api/event-system/events/:eventId deletes an event", async () => {
    mockDeleteEvent.mockResolvedValue(event);

    const response = await supertest(app).delete("/api/event-system/events/event-1");

    expect(response.status).toBe(200);
    expect(mockDeleteEvent).toHaveBeenCalledWith("event-1");
  });

  it("GET /api/event-system/events/:eventId/attendees lists attendees", async () => {
    mockListEventAttendees.mockResolvedValue({ list: [attendee], count: 1 });

    const response = await supertest(app)
      .get("/api/event-system/events/event-1/attendees")
      .query({ pageNumber: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(mockListEventAttendees).toHaveBeenCalledWith("event-1");
  });

  it("POST /api/event-system/checkin checks in attendee", async () => {
    mockCheckInToEvent.mockResolvedValue({
      attendance: {
        id: "att-1",
        event_id: "event-1",
        user_id: "user-2",
        checkin_method: "NFC",
        is_present: true,
        created_at: new Date().toISOString(),
      },
    });

    const response = await supertest(app)
      .post("/api/event-system/events/checkin")
      .send({
        data: {
          eventId: "event-1",
          attendeeId: "user-2",
          checkinMethod: "NFC",
        },
      });

    expect(response.status).toBe(200);
    expect(mockCheckInToEvent).toHaveBeenCalledWith("event-1", "user-2", "NFC");
  });
});
