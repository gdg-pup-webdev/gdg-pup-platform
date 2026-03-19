import { describe, it, expect, beforeEach } from "vitest";
import { GetGdgMerch } from "../GetGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { GdgMerch } from "../../domain/GdgMerch";

describe("GetGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let getGdgMerch: GetGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    getGdgMerch = new GetGdgMerch(repo);
  });

  it("should successfully retrieve an existing GdgMerch by ID", async () => {
    const merch = GdgMerch.create({
      name: "GDG Notebook",
      image: "notebook.png",
      points: 150,
      stock: 20,
    });
    await repo.saveNew(merch);

    const result = await getGdgMerch.execute(merch.props.id);

    expect(result).not.toBeNull();
    expect(result?.props.id).toBe(merch.props.id);
    expect(result?.props.name).toBe("GDG Notebook");
  });

  it("should return null if the GdgMerch ID does not exist", async () => {
    const result = await getGdgMerch.execute("invalid-id");

    expect(result).toBeNull();
  });
});
