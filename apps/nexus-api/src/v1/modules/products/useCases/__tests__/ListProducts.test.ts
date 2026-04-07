import { beforeEach, describe, expect, it } from "vitest";
import { ListProducts } from "../ListProducts";
import { Product } from "../../domain/Product";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("ListProducts Use Case", () => {
  let repository: MockProductRepository;
  let useCase: ListProducts;

  beforeEach(async () => {
    repository = new MockProductRepository();
    useCase = new ListProducts(repository);

    const products = [
      Product.create({
        name: "Product A",
        description: "Desc A",
        category: "A",
        image: "https://example.com/a.png",
      }),
      Product.create({
        name: "Product B",
        description: "Desc B",
        category: "B",
        image: "https://example.com/b.png",
      }),
      Product.create({
        name: "Product C",
        description: "Desc C",
        category: "C",
        image: "https://example.com/c.png",
      }),
    ];

    for (const product of products) {
      await repository.saveNew(product);
    }
  });

  it("returns paginated products and total count", async () => {
    const result = await useCase.execute(1, 2);

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(3);
  });

  it("returns second page correctly", async () => {
    const result = await useCase.execute(2, 2);

    expect(result.list).toHaveLength(1);
    expect(result.count).toBe(3);
  });
});
