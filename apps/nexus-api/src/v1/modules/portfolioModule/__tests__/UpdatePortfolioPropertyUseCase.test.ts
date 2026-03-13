import { describe, it, expect, beforeEach } from "vitest";
import { UpdatePortfolioPropertyUseCase } from "../useCase/UpdatePortfolioPropertyUseCase";
import {
  MockPortfolioRepository,
  buildPortfolioProps,
} from "./MockPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("UpdatePortfolioPropertyUseCase", () => {
  let repo: MockPortfolioRepository;
  let useCase: UpdatePortfolioPropertyUseCase;

  beforeEach(() => {
    repo = new MockPortfolioRepository();
    useCase = new UpdatePortfolioPropertyUseCase(repo);
  });

  it("updates the bio of an existing portfolio", async () => {
    repo.portfolios = [
      Portfolio.hydrate(buildPortfolioProps({ id: "p-1", bio: "Old bio" })),
    ];

    const result = await useCase.execute("p-1", { bio: "New bio" });

    expect(result.props.bio).toBe("New bio");
  });

  it("updates social links without affecting unrelated fields", async () => {
    const original = buildPortfolioProps({
      id: "p-1",
      githubUrl: "https://github.com/old",
      bio: "Stays the same",
    });
    repo.portfolios = [Portfolio.hydrate(original)];

    const result = await useCase.execute("p-1", {
      githubUrl: "https://github.com/new",
    });

    expect(result.props.githubUrl).toBe("https://github.com/new");
    expect(result.props.bio).toBe("Stays the same");
  });

  it("updates skills and interests arrays", async () => {
    repo.portfolios = [
      Portfolio.hydrate(
        buildPortfolioProps({ id: "p-1", technicalSkills: ["HTML"] }),
      ),
    ];

    const result = await useCase.execute("p-1", {
      technicalSkills: ["TypeScript", "Node.js"],
      learningInterests: ["AI"],
    });

    expect(result.props.technicalSkills).toEqual(["TypeScript", "Node.js"]);
    expect(result.props.learningInterests).toEqual(["AI"]);
  });

  it("updates personal information fields", async () => {
    repo.portfolios = [
      Portfolio.hydrate(
        buildPortfolioProps({ id: "p-1", department: "Design" }),
      ),
    ];

    const result = await useCase.execute("p-1", {
      department: "Web Dev",
      membershipType: "Core",
    });

    expect(result.props.department).toBe("Web Dev");
    expect(result.props.membershipType).toBe("Core");
  });

  it("throws NotFoundError when the portfolio does not exist", async () => {
    repo.portfolios = [];

    await expect(
      useCase.execute("nonexistent-id", { bio: "Something" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("applying an empty update object leaves the portfolio unchanged", async () => {
    const original = buildPortfolioProps({ id: "p-1", bio: "Original bio" });
    repo.portfolios = [Portfolio.hydrate(original)];

    const result = await useCase.execute("p-1", {});

    expect(result.props.bio).toBe("Original bio");
  });
});
