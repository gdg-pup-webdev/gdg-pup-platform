import { beforeEach, describe, expect, it } from "vitest";
import { UpdateStudyJam } from "../useCases/UpdateStudyJam";
import { MockStudyJamRepository } from "../infrastructure/MockStudyJamRepository";
import { buildStudyJam } from "./test-helpers";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("UpdateStudyJam", () => {
  let repo: MockStudyJamRepository;
  let useCase: UpdateStudyJam;

  beforeEach(() => {
    repo = new MockStudyJamRepository();
    useCase = new UpdateStudyJam(repo);
  });

  it("updates the allowed study jam fields", async () => {
    repo.studyJams = [buildStudyJam({ id: "studyjam-1" })];

    const result = await useCase.execute("studyjam-1", {
      title: "Updated title",
      summary: "Updated summary",
    });

    expect(result.props.title).toBe("Updated title");
    expect(result.props.summary).toBe("Updated summary");
  });

  it("throws when the study jam does not exist", async () => {
    await expect(
      useCase.execute("missing-id", { title: "Updated title" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
