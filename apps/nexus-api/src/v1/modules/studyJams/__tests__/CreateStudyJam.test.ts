import { beforeEach, describe, expect, it } from "vitest";
import { CreateStudyJam } from "../useCases/CreateStudyJam";
import { MockStudyJamRepository } from "../infrastructure/MockStudyJamRepository";

describe("CreateStudyJam", () => {
  let repo: MockStudyJamRepository;
  let useCase: CreateStudyJam;

  beforeEach(() => {
    repo = new MockStudyJamRepository();
    useCase = new CreateStudyJam(repo);
  });

  it("creates a study jam with the required fields", async () => {
    const result = await useCase.execute({
      creatorId: "user-1",
      title: "Study Jam: React",
      summary: "Build a small UI together.",
      description: "Hands-on workshop for the resource library.",
    });

    expect(result.props.id).toBeTruthy();
    expect(result.props.creatorId).toBe("user-1");
    expect(result.props.title).toBe("Study Jam: React");
    expect(repo.studyJams).toHaveLength(1);
  });

  it("rejects missing title or description", async () => {
    await expect(
      useCase.execute({
        creatorId: "user-1",
        title: "",
        summary: "Summary",
        description: "",
      }),
    ).rejects.toThrow("Title and description are required.");
  });
});
