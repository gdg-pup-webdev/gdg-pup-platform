import { describe, it, expect, beforeEach, vi } from "vitest";
import { RestockGdgMerch } from "../RestockGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { GdgMerch } from "../../domain/GdgMerch";

describe("RestockGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let restockGdgMerch: RestockGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    restockGdgMerch = new RestockGdgMerch(repo);
  });

  it("should successfully restock an existing GdgMerch", async () => {
    const merch = GdgMerch.create({
      name: "GDG Pen",
      image: "pen.jpg",
      points: 20,
      stock: 5,
    });
    await repo.saveNew(merch);

    const spyPersistUpdates = vi.spyOn(repo, "persistUpdates");

    const result = await restockGdgMerch.execute(merch.props.id, 15);

    expect(result.props.stock).toBe(20);
    expect(spyPersistUpdates).toHaveBeenCalledTimes(1);
    expect(spyPersistUpdates).toHaveBeenCalledWith(result);

    const updatedMerch = await repo.findById(merch.props.id);
    expect(updatedMerch?.props.stock).toBe(20);
  });

  it("should throw an error if the GdgMerch ID does not exist", async () => {
    await expect(restockGdgMerch.execute("fake-id", 10)).rejects.toThrow(
      "Cannot restock: Merch with ID fake-id not found."
    );
  });

  it("should throw an error if attempting to restock with zero or negative amounts", async () => {
    const merch = GdgMerch.create({
      name: "GDG Pen",
      image: "pen.jpg",
      points: 20,
      stock: 5,
    });
    await repo.saveNew(merch);

    await expect(restockGdgMerch.execute(merch.props.id, 0)).rejects.toThrow(
      "Restock amount must be greater than zero."
    );

    await expect(restockGdgMerch.execute(merch.props.id, -5)).rejects.toThrow(
      "Restock amount must be greater than zero."
    );
  });
});
