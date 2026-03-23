import { describe, it, expect, beforeEach } from "vitest";
import { MockGdgMemberRepository } from "../infrastructure/MockGdgMemberRepository";
import { ImportGdgMembersFromCsv } from "../useCases/ImportGdgMembersFromCsv";
import { ExportGdgMembersToCsv } from "../useCases/ExportGdgMembersToCsv";

describe("CSV Import/Export", () => {
  let repo: MockGdgMemberRepository;
  let importUseCase: ImportGdgMembersFromCsv;
  let exportUseCase: ExportGdgMembersToCsv;

  beforeEach(() => {
    repo = new MockGdgMemberRepository();
    importUseCase = new ImportGdgMembersFromCsv(repo);
    exportUseCase = new ExportGdgMembersToCsv(repo);
  });

  it("should import members from CSV string", async () => {
    const csv = `gdgId,email,program,department,displayName,firstName,lastName,suffix
GDG-X1,user1@example.com,BSCS,SCIS,User One,User,One,
GDG-X2,user2@example.com,BSIT,SCIS,User Two,User,Two,Jr.`;

    const result = await importUseCase.execute(csv);

    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);

    const { count } = await repo.findAll(1, 10);
    expect(count).toBe(2);
  });

  it("should export members to CSV string", async () => {
    const csvInput = `gdgId,email,program,department,displayName,firstName,lastName,suffix
GDG-X1,user1@example.com,BSCS,SCIS,User One,User,One,`;
    await importUseCase.execute(csvInput);

    const exported = await exportUseCase.execute();
    expect(exported).toContain("user1@example.com");
    expect(exported).toContain("GDG-X1");
    expect(exported.split("\n").length).toBe(2); // Header + 1 row
  });
});
