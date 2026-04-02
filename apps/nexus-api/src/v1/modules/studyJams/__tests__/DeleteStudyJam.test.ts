import { beforeEach, describe, expect, it } from "vitest";
import { DeleteStudyJam } from "../useCases/DeleteStudyJam";
import { MockStudyJamRepository } from "../infrastructure/MockStudyJamRepository";
import { buildStudyJam } from "./test-helpers";

describe("DeleteStudyJam", () => {
  let repo: MockStudyJamRepository;
  let useCase: DeleteStudyJam;

  beforeEach(() => {
    repo = new MockStudyJamRepository();
    useCase = new DeleteStudyJam(repo);
  });

  it("deletes an existing study jam", async () => {
    repo.studyJams = [buildStudyJam({ id: "studyjam-1" })];

    const result = await useCase.execute("studyjam-1");

    expect(result).toBe(true);
    expect(repo.studyJams).toHaveLength(0);
  });

  it("throws when the study jam does not exist", async () => {
    await expect(useCase.execute("missing-id")).rejects.toThrow(
      "Cannot delete: Study Jam with ID missing-id not found.",
    );
  });
});
