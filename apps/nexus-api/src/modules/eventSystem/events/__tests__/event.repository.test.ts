/**
 * @file event.repository.test.ts
 * @description Event repository tests verify Supabase query chains and error
 * mapping with a mocked client to avoid real DB access.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase.js", () => ({
  supabase: supabaseMock,
}));

import { EventRepository } from "../event.repository.js";
import { ServerError } from "@/errors/ServerError.js";

describe("EventRepository", () => {
  const repository = new EventRepository();
  const event = { id: "event-1", title: "Test Event" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listEvents applies filters, order, and range", async () => {
    const rangeMock = vi
      .fn()
      .mockResolvedValue({ data: [event], count: 1, error: null });
    const query = {
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeMock,
    };
    const selectMock = vi.fn().mockReturnValue(query);

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.listEvents(2, 10, {
      creator_id: "user-1",
      category: "workshop",
      venue: "room-1",
      start_date_gte: "2024-01-01",
      start_date_lte: "2024-01-31",
      end_date_gte: "2024-01-01",
      end_date_lte: "2024-01-31",
    });

    expect(supabaseMock.from).toHaveBeenCalledWith("event");
    expect(selectMock).toHaveBeenCalledWith("*", { count: "exact" });
    expect(query.eq).toHaveBeenCalledWith("creator_id", "user-1");
    expect(query.eq).toHaveBeenCalledWith("category", "workshop");
    expect(query.eq).toHaveBeenCalledWith("venue", "room-1");
    expect(query.gte).toHaveBeenCalledWith("start_date", "2024-01-01");
    expect(query.lte).toHaveBeenCalledWith("start_date", "2024-01-31");
    expect(query.gte).toHaveBeenCalledWith("end_date", "2024-01-01");
    expect(query.lte).toHaveBeenCalledWith("end_date", "2024-01-31");
    expect(query.order).toHaveBeenCalledWith("start_date", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(10, 19);
    expect(result).toEqual({ list: [event], count: 1 });
  });

  it("listEvents maps query error to DatabaseError", async () => {
    const rangeMock = vi
      .fn()
      .mockResolvedValue({
        data: null,
        count: null,
        error: { message: "fail" },
      });
    const query = {
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeMock,
    };
    const selectMock = vi.fn().mockReturnValue(query);

    supabaseMock.from.mockReturnValue({ select: selectMock });

    await expect(
      repository.listEvents(1, 10, {
        creator_id: "user-1",
      }),
    ).rejects.toBeInstanceOf(ServerError);
  });

  it("getEventById filters by id", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: event, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    supabaseMock.from.mockReturnValue({ select: selectMock });

    const result = await repository.getEventById("event-1");

    expect(eqMock).toHaveBeenCalledWith("id", "event-1");
    expect(result).toEqual(event);
  });

  it("createEvent inserts dto", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: event, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    supabaseMock.from.mockReturnValue({ insert: insertMock });

    const result = await repository.createEvent(event as any);

    expect(insertMock).toHaveBeenCalledWith(event);
    expect(result).toEqual(event);
  });
});
