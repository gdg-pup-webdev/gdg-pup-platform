import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteProduct } from "../DeleteProduct";
import { Product } from "../../domain/Product";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("DeleteProduct Use Case", () => {
  let repository: MockProductRepository;
  let useCase: DeleteProduct;

  beforeEach(() => {
    repository = new MockProductRepository();
    useCase = new DeleteProduct(repository);
  });

  it("deletes an existing product", async () => {
    const product = Product.create({
      name: "To Delete",
      description: "Delete me",
      category: "Test",
      image: "https://example.com/delete.png",
    });
    await repository.saveNew(product);

    const spyDelete = vi.spyOn(repository, "delete");

    await useCase.execute(product.props.id);

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(spyDelete).toHaveBeenCalledWith(product.props.id);

    const result = await repository.findById(product.props.id);
    expect(result).toBeNull();
  });

  it("throws when trying to delete a non-existent product", async () => {
    await expect(useCase.execute("missing-id")).rejects.toThrow(NotFoundError);
  });
});
