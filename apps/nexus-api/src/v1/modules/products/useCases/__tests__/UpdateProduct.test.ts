import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateProduct } from "../UpdateProduct";
import { Product } from "../../domain/Product";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("UpdateProduct Use Case", () => {
  let repository: MockProductRepository;
  let useCase: UpdateProduct;

  beforeEach(() => {
    repository = new MockProductRepository();
    useCase = new UpdateProduct(repository);
  });

  it("updates an existing product", async () => {
    const product = Product.create({
      name: "Old Name",
      description: "Old Description",
      category: "Old Category",
      image: "https://example.com/old.png",
    });
    await repository.saveNew(product);

    const spyPersistUpdates = vi.spyOn(repository, "persistUpdates");

    const result = await useCase.execute(product.props.id, {
      name: "New Name",
      category: "New Category",
    });

    expect(result.props.name).toBe("New Name");
    expect(result.props.category).toBe("New Category");
    expect(result.props.description).toBe("Old Description");
    expect(spyPersistUpdates).toHaveBeenCalledTimes(1);
  });

  it("throws when the product does not exist", async () => {
    await expect(
      useCase.execute("non-existent-id", { name: "New" }),
    ).rejects.toThrow("Product with ID non-existent-id not found");
  });
});
