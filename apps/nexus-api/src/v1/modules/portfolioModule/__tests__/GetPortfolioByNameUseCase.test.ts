import { describe, it, expect, beforeEach } from "vitest";
import { GetPortfolioByNameUseCase } from "../useCase/GetPortfolioByNameUseCase";
import {
  MockPortfolioRepository,
  buildPortfolioProps,
} from "./MockPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("GetPortfolioByNameUseCase", () => {
  let repo: MockPortfolioRepository;
  let useCase: GetPortfolioByNameUseCase;

  beforeEach(() => {
    repo = new MockPortfolioRepository();
    useCase = new GetPortfolioByNameUseCase(repo);
  });

  it("returns the portfolio matching the given display name", async () => {
    const props = buildPortfolioProps({ nickname: "maria" });
    repo.portfolios = [Portfolio.hydrate(props)];

    const result = await useCase.execute("maria");

    expect(result.props.nickname).toBe("maria");
  });

  it("throws NotFoundError when no portfolio matches the given name", async () => {
    repo.portfolios = [];

    await expect(useCase.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });

  it("returns the correct portfolio when multiple portfolios exist", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "p-1", nickname: "ana" })),
      Portfolio.hydrate(buildPortfolioProps({ id: "p-2", nickname: "ben" })),
    ];

    const result = await useCase.execute("ben");

    expect(result.props.id).toBe("p-2");
    expect(result.props.nickname).toBe("ben");
  });
});
