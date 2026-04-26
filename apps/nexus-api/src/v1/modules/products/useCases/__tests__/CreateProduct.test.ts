import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateProduct } from "../CreateProduct";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("CreateProduct Use Case", () => {
  let repository: MockProductRepository;
  let useCase: CreateProduct;

  beforeEach(() => {
    repository = new MockProductRepository();
    useCase = new CreateProduct(repository);
  });

  it("creates a product and saves it in the repository", async () => {
    const spySaveNew = vi.spyOn(repository, "saveNew");

    const result = await useCase.execute({
      name: "GDG Product",
      description: "Community platform",
      category: "Platform",
      image: "https://example.com/product.png",
      link: "https://example.com",
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.name).toBe("GDG Product");
    expect(result.props.description).toBe("Community platform");
    expect(result.props.category).toBe("Platform");
    expect(result.props.image).toBe("https://example.com/product.png");
    expect(result.props.link).toBe("https://example.com");

    expect(spySaveNew).toHaveBeenCalledTimes(1);

    const savedProduct = await repository.findById(result.props.id);
    expect(savedProduct).not.toBeNull();
    expect(savedProduct?.props.name).toBe("GDG Product");
  });
});
