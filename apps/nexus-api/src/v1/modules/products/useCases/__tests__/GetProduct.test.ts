import { beforeEach, describe, expect, it } from "vitest";
import { GetProduct } from "../GetProduct";
import { Product } from "../../domain/Product";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("GetProduct Use Case", () => {
  let repository: MockProductRepository;
  let useCase: GetProduct;

  beforeEach(() => {
    repository = new MockProductRepository();
    useCase = new GetProduct(repository);
  });

  it("returns a product by id when it exists", async () => {
    const product = Product.create({
      name: "Starter Kit",
      description: "Starter product",
      category: "Kit",
      image: "https://example.com/kit.png",
      link: "https://example.com/kit",
    });
    await repository.saveNew(product);

    const result = await useCase.execute(product.props.id);

    expect(result).not.toBeNull();
    expect(result?.props.id).toBe(product.props.id);
    expect(result?.props.name).toBe("Starter Kit");
  });

  it("returns null when product does not exist", async () => {
    const result = await useCase.execute("non-existent-id");
    expect(result).toBeNull();
  });
});
