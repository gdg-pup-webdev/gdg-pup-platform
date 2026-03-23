// import { describe, it, expect, beforeEach } from "vitest";
// import { MockGdgMemberRepository } from "../infrastructure/MockGdgMemberRepository";
// import { GdgMember } from "../domain/GdgMember";
// import { FindMemberByGdgId } from "../useCases/FindMemberByGdgId";

// describe("FindMemberByGdgId Use Case", () => {
//   let repo: MockGdgMemberRepository;
//   let useCase: FindMemberByGdgId;

//   beforeEach(() => {
//     repo = new MockGdgMemberRepository();
//     useCase = new FindMemberByGdgId(repo);
//   });

//   it("should find a member by their gdgId", async () => {
//     const member = GdgMember.hydrate({
//       id: "GDGPUP-26-000001",
//       gdgId: "GDG-X1",
//       email: "test@example.com",
//       program: "BSCS",
//       department: "SCIS",
//       displayName: "Test User",
//       firstName: "Test",
//       lastName: "User",
//       suffix: null,
//     });
//     await repo.saveNew(member);

//     const result = await useCase.execute("GDG-X1");

//     expect(result).not.toBeNull();
//     expect(result?.props.gdgId).toBe("GDG-X1");
//     expect(result?.props.email).toBe("test@example.com");
//   });

//   it("should return null if member with gdgId does not exist", async () => {
//     const result = await useCase.execute("NON-EXISTENT");
//     expect(result).toBeNull();
//   });
// });
