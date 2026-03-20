import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteGdgMerch } from "../DeleteGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { GdgMerch } from "../../domain/GdgMerch";

describe("DeleteGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let deleteGdgMerch: DeleteGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    deleteGdgMerch = new DeleteGdgMerch(repo);
  });

  it("should successfully delete an existing GdgMerch", async () => {
    const merch = GdgMerch.create({
      name: "GDG Sticker",
      image: "sticker.png",
      points: 10,
      stock: 500,
    });
    await repo.saveNew(merch);

    const spyDelete = vi.spyOn(repo, "delete");

    await deleteGdgMerch.execute(merch.props.id);

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(spyDelete).toHaveBeenCalledWith(merch.props.id);

    const checkMerch = await repo.findById(merch.props.id);
    expect(checkMerch).toBeNull();
  });

  it("should throw an error if the GdgMerch ID does not exist", async () => {
    const fakeId = "non-existent-id";

    await expect(deleteGdgMerch.execute(fakeId)).rejects.toThrow(
      `Cannot delete: Merch with ID ${fakeId} not found.`
    );
  });
});
