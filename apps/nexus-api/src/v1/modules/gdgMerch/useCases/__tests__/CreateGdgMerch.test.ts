import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateGdgMerch } from "../CreateGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";

describe("CreateGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let createGdgMerch: CreateGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    createGdgMerch = new CreateGdgMerch(repo);
  });

  it("should successfully create a new GdgMerch and save it in the repository", async () => {
    const props = {
      name: "GDG Mug",
      image: "mug.jpg",
      points: 50,
      stock: 100,
    };

    const spySaveNew = vi.spyOn(repo, "saveNew");

    const result = await createGdgMerch.execute(props);

    expect(result).toBeDefined();
    expect(result.props.id).toBeDefined();
    expect(result.props.name).toBe("GDG Mug");
    expect(result.props.points).toBe(50);
    expect(result.props.stock).toBe(100);

    expect(spySaveNew).toHaveBeenCalledTimes(1);
    expect(spySaveNew).toHaveBeenCalledWith(result);

    const savedMerch = await repo.findById(result.props.id);
    expect(savedMerch).not.toBeNull();
    expect(savedMerch?.props.name).toBe("GDG Mug");
  });
});
