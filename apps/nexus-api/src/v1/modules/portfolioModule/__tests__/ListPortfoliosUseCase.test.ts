import { describe, it, expect, beforeEach } from "vitest";
import { ListPortfoliosUseCase } from "../useCase/ListPortfoliosUseCase";
import {
  MockPortfolioRepository,
  buildPortfolioProps,
} from "./MockPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

describe("ListPortfoliosUseCase", () => {
  let repo: MockPortfolioRepository;
  let useCase: ListPortfoliosUseCase;

  beforeEach(() => {
    repo = new MockPortfolioRepository();
    useCase = new ListPortfoliosUseCase(repo);
  });

  it("returns an empty list when no portfolios exist", async () => {
    const result = await useCase.execute(1, 10);

    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(0);
  });

  it("returns all portfolios on the first page when count is within page size", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "portfolio-1" })),
      Portfolio.hydrate(buildPortfolioProps({ id: "portfolio-2" })),
    ];

    const result = await useCase.execute(1, 10);

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(2);
  });

  it("paginates correctly for page 2", async () => {
    repo.portfolios = Array.from({ length: 5 }, (_, i) =>
      Portfolio.hydrate(buildPortfolioProps({ id: `portfolio-${i + 1}` })),
    );

    const result = await useCase.execute(2, 3);

    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(5);
  });

  it("returns an empty list when the requested page is beyond total count", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "portfolio-1" })),
    ];

    const result = await useCase.execute(2, 10);

    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(1);
  });
});
