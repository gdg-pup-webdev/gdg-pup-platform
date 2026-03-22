import { describe, it, expect, beforeEach } from "vitest";
import { MockGdgMemberRepository } from "../infrastructure/MockGdgMemberRepository";
import { GdgMember } from "../domain/GdgMember";
import { UpdateGdgMember } from "../useCases/UpdateGdgMember";

describe("UpdateGdgMember Use Case", () => {
  let repo: MockGdgMemberRepository;
  let useCase: UpdateGdgMember;

  beforeEach(() => {
    repo = new MockGdgMemberRepository();
    useCase = new UpdateGdgMember(repo);
  });

  it("should update an existing member", async () => {
    const member = GdgMember.hydrate({
      id: "GDGPUP-26-000001",
      gdgId: "GDG-001",
      email: "old@example.com",
      program: "BSCS",
      department: "SCIS",
      displayName: "Old Name",
      firstName: "Old",
      lastName: "Name",
      suffix: null,
    });
    await repo.saveNew(member);

    const result = await useCase.execute("GDGPUP-26-000001", {
      displayName: "New Name",
      email: "new@example.com"
    });

    expect(result.props.displayName).toBe("New Name");
    expect(result.props.email).toBe("new@example.com");
    expect(result.props.firstName).toBe("Old"); // Unchanged
  });

  it("should throw error if member not found", async () => {
    await expect(useCase.execute("NON-EXISTENT", { displayName: "New" }))
      .rejects.toThrow("GdgMember not found");
  });
});
