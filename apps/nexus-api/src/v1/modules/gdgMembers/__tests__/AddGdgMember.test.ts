// import { describe, it, expect, beforeEach } from "vitest";
// import { MockGdgMemberRepository } from "../infrastructure/MockGdgMemberRepository";
// import { AddGdgMember } from "../useCases/AddGdgMember";

// describe("AddGdgMember Use Case", () => {
//   let repo: MockGdgMemberRepository;
//   let useCase: AddGdgMember;

//   beforeEach(() => {
//     repo = new MockGdgMemberRepository();
//     useCase = new AddGdgMember(repo);
//   });

//   it("should create a member with a correctly formatted ID", async () => {
//     const input = {
//       gdgId: "GDG-001",
//       email: "test@example.com",
//       program: "BSCS",
//       department: "SCIS",
//       displayName: "Test User",
//       firstName: "Test",
//       lastName: "User",
//       suffix: null,
//     };

//     const yearPrefix = new Date().getFullYear().toString().slice(-2);
//     const result = await useCase.execute(input);

//     expect(result.props.id).toMatch(new RegExp(`^GDGPUP-${yearPrefix}-\\d{6}$`));
//     expect(result.props.email).toBe(input.email);
//     expect(result.props.id).toBe(`GDGPUP-${yearPrefix}-000001`);
//   });

//   it("should increment the ID number for subsequent members", async () => {
//     const input = {
//       gdgId: "GDG-001",
//       email: "test@example.com",
//       program: "BSCS",
//       department: "SCIS",
//       displayName: "Test User",
//       firstName: "Test",
//       lastName: "User",
//       suffix: null,
//     };

//     const yearPrefix = new Date().getFullYear().toString().slice(-2);
//     await useCase.execute(input);
//     const result2 = await useCase.execute({ ...input, email: "test2@example.com" });

//     expect(result2.props.id).toBe(`GDGPUP-${yearPrefix}-000002`);
//   });
// });
