/**
 * @file event.repository.test.ts
 * @description Event repository tests verify Supabase query chains and error
 * mapping with a mocked client to avoid real DB access.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DatabaseError } from "../../../../classes/ServerError.js";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase.js", () => ({
  supabase: supabaseMock,
}));

import { EventRepository } from "../event.repository.js";

describe("EventRepository", () => {
  const repository = new EventRepository();
  const event = { id: "event-1", title: "Test Event" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listEvents selects and counts", async () => {
    const listSelectMock = vi.fn().mockResolvedValue({ data: [event], error: null });
    const countSelectMock = vi.fn().mockResolvedValue({ count: 1, error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    const result = await repository.listEvents();

    expect(supabaseMock.from).toHaveBeenCalledWith("event");
    expect(result).toEqual({ list: [event], count: 1 });
  });

  it("listEvents maps count error to DatabaseError", async () => {
    const listSelectMock = vi.fn().mockResolvedValue({ data: [event], error: null });
    const countSelectMock = vi
      .fn()
      .mockResolvedValue({ count: null, error: { message: "fail" } });

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: listSelectMock }))
      .mockImplementationOnce(() => ({ select: countSelectMock }));

    await expect(repository.listEvents()).rejects.toBeInstanceOf(DatabaseError);
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
