import { beforeEach, describe, expect, it } from "vitest";
import { GetOneStudyJam } from "../useCases/GetOneStudyJam";
import { MockStudyJamRepository } from "../infrastructure/MockStudyJamRepository";
import { buildStudyJam } from "./test-helpers";
import { NotFoundError } from "@/v1/errors/HttpError";

describe("GetOneStudyJam", () => {
  let repo: MockStudyJamRepository;
  let useCase: GetOneStudyJam;

  beforeEach(() => {
    repo = new MockStudyJamRepository();
    useCase = new GetOneStudyJam(repo);
  });

  it("returns the matching study jam", async () => {
    repo.studyJams = [buildStudyJam({ id: "studyjam-abc" })];

    const result = await useCase.execute("studyjam-abc");

    expect(result.props.id).toBe("studyjam-abc");
  });

  it("throws when no study jam matches the given ID", async () => {
    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
