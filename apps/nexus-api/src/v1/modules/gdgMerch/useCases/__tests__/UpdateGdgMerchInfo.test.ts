import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdateGdgMerchInfo } from "../UpdateGdgMerchInfo";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { GdgMerch } from "../../domain/GdgMerch";

describe("UpdateGdgMerchInfo Use Case", () => {
  let repo: MockGdgMerchRepository;
  let updateGdgMerchInfo: UpdateGdgMerchInfo;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    updateGdgMerchInfo = new UpdateGdgMerchInfo(repo);
  });

  it("should successfully update partial info of an existing GdgMerch", async () => {
    const merch = GdgMerch.create({
      name: "Old Name",
      image: "old_image.png",
      points: 50,
      stock: 100,
    });
    await repo.saveNew(merch);

    const spyPersistUpdates = vi.spyOn(repo, "persistUpdates");

    const result = await updateGdgMerchInfo.execute(merch.props.id, {
      name: "New Name",
      points: 80,
    });

    // Check assertions
    expect(result.props.name).toBe("New Name");
    expect(result.props.image).toBe("old_image.png"); // unchanged
    expect(result.props.points).toBe(80);
    expect(result.props.stock).toBe(100); // unaffected by info update

    expect(spyPersistUpdates).toHaveBeenCalledTimes(1);

    const updatedMerch = await repo.findById(merch.props.id);
    expect(updatedMerch?.props.name).toBe("New Name");
  });

  it("should successfully update with empty changes (no-op)", async () => {
    const merch = GdgMerch.create({
      name: "Consistent Name",
      image: "image.png",
      points: 50,
      stock: 100,
    });
    await repo.saveNew(merch);

    const result = await updateGdgMerchInfo.execute(merch.props.id, {});

    expect(result.props.name).toBe("Consistent Name");
  });

  it("should throw an error if the GdgMerch ID does not exist", async () => {
    await expect(updateGdgMerchInfo.execute("non-existent", { points: 10 })).rejects.toThrow(
      "Cannot update: Merch with ID non-existent not found."
    );
  });
});
