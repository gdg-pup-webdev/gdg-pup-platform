import { describe, it, expect, beforeEach } from "vitest";
import { GetPortfolioByGdgIdUseCase } from "../useCase/GetPortfolioByGdgIdUseCase";
import {
  MockPortfolioRepository,
  buildPortfolioProps,
} from "./MockPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("GetPortfolioByGdgIdUseCase", () => {
  let repo: MockPortfolioRepository;
  let useCase: GetPortfolioByGdgIdUseCase;

  beforeEach(() => {
    repo = new MockPortfolioRepository();
    useCase = new GetPortfolioByGdgIdUseCase(repo);
  });

  it("returns the portfolio matching the given GDG ID", async () => {
    const props = buildPortfolioProps({ gdgId: "GDG-042" });
    repo.portfolios = [Portfolio.hydrate(props)];

    const result = await useCase.execute("GDG-042");

    expect(result.props.gdgId).toBe("GDG-042");
  });

  it("throws NotFoundError when no portfolio matches the given GDG ID", async () => {
    repo.portfolios = [];

    await expect(useCase.execute("GDG-999")).rejects.toThrow(NotFoundError);
  });

  it("returns the correct portfolio when multiple portfolios exist", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "p-1", gdgId: "GDG-001" })),
      Portfolio.hydrate(buildPortfolioProps({ id: "p-2", gdgId: "GDG-002" })),
    ];

    const result = await useCase.execute("GDG-002");

    expect(result.props.id).toBe("p-2");
    expect(result.props.gdgId).toBe("GDG-002");
  });

  it("throws NotFoundError when the portfolio has a null GDG ID", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "p-1", gdgId: null })),
    ];

    await expect(useCase.execute("GDG-001")).rejects.toThrow(NotFoundError);
  });
});
