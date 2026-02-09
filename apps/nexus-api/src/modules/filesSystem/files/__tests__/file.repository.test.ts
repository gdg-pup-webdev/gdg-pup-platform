/**
 * @file file.repository.test.ts
 * @description Unit tests for FileRepository query intent and error mapping.
 * Supabase is mocked so schema expectations are validated without DB writes.
 */
import { beforeEach, describe, expect, it, vi } from "vitest"; 
import { FileRepository } from "../file.repository.js";
import { ServerError } from "@/errors/ServerError.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

/**
 * Supabase is mocked so repository tests assert query intent and
 * error mapping without touching real tables or schemas.
 */
vi.mock("@/lib/supabase.js", () => ({
  supabase: {
    from: fromMock,
  },
}));

/**
 * Repository unit tests validate:
 * - correct table usage
 * - expected query-chain composition
 * - translation of Supabase errors into DatabaseError
 */
describe("FileRepository", () => {
  const repository = new FileRepository();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list uses table + pagination chain", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: [{ id: "file-1" }],
      error: null,
      count: 1,
    });

    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeMock,
    } as any;

    fromMock.mockReturnValue(chain);

    const result = await repository.list({ pageNumber: 2, pageSize: 10 });

    expect(fromMock).toHaveBeenCalledWith("file");
    expect(chain.select).toHaveBeenCalledWith("*", { count: "exact" });
    expect(chain.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(rangeMock).toHaveBeenCalledWith(10, 19);
    expect(result.count).toBe(1);
  });

  it("getOne maps supabase errors to ServerError", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "boom" },
    });

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: singleMock,
    } as any;

    fromMock.mockReturnValue(chain);

    await expect(repository.getOne("file-1")).rejects.toBeInstanceOf(
      ServerError,
    );
  });

  it("create inserts and selects single record", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: { id: "file-2" },
      error: null,
    });

    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: singleMock,
    } as any;

    fromMock.mockReturnValue(chain);

    const result = await repository.create({ name: "New" });

    expect(chain.insert).toHaveBeenCalledWith({ name: "New" });
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(result.id).toBe("file-2");
  });
});
