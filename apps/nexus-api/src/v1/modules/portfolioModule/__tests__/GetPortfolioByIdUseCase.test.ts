import { describe, it, expect, beforeEach } from "vitest";
import { GetPortfolioByIdUseCase } from "../useCase/GetPortfolioByIdUseCase";
import {
  MockPortfolioRepository,
  buildPortfolioProps,
} from "./MockPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("GetPortfolioByIdUseCase", () => {
  let repo: MockPortfolioRepository;
  let useCase: GetPortfolioByIdUseCase;

  beforeEach(() => {
    repo = new MockPortfolioRepository();
    useCase = new GetPortfolioByIdUseCase(repo);
  });

  it("returns the portfolio matching the given ID", async () => {
    const props = buildPortfolioProps({ id: "portfolio-abc" });
    repo.portfolios = [Portfolio.hydrate(props)];

    const result = await useCase.execute("portfolio-abc");

    expect(result.props.id).toBe("portfolio-abc");
    expect(result.props.fullName).toBe(props.fullName);
  });

  it("throws NotFoundError when no portfolio matches the given ID", async () => {
    repo.portfolios = [];

    await expect(useCase.execute("nonexistent-id")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("returns only the portfolio for the matching ID when multiple exist", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "portfolio-1" })),
      Portfolio.hydrate(buildPortfolioProps({ id: "portfolio-2" })),
    ];

    const result = await useCase.execute("portfolio-2");

    expect(result.props.id).toBe("portfolio-2");
  });
});
