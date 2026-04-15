import { beforeEach, describe, expect, it } from "vitest";
import { ListStudyJams } from "../useCases/ListStudyJams";
import { MockStudyJamRepository } from "../infrastructure/MockStudyJamRepository";
import { buildStudyJam } from "./test-helpers";

describe("ListStudyJams", () => {
  let repo: MockStudyJamRepository;
  let useCase: ListStudyJams;

  beforeEach(() => {
    repo = new MockStudyJamRepository();
    useCase = new ListStudyJams(repo);
  });

  it("returns paginated results", async () => {
    repo.studyJams = [
      buildStudyJam({ id: "studyjam-1", title: "A" }),
      buildStudyJam({ id: "studyjam-2", title: "B" }),
      buildStudyJam({ id: "studyjam-3", title: "C" }),
    ];

    const result = await useCase.execute(2, 1);

    expect(result.count).toBe(3);
    expect(result.list).toHaveLength(1);
  });

  it("supports simple search filters", async () => {
    repo.studyJams = [
      buildStudyJam({ id: "studyjam-1", title: "Alpha workshop" }),
      buildStudyJam({ id: "studyjam-2", title: "Beta session" }),
    ];

    const result = await useCase.execute(1, 10, { search: "Alpha" });

    expect(result.count).toBe(1);
    expect(result.list[0]?.props.title).toBe("Alpha workshop");
  });
});
