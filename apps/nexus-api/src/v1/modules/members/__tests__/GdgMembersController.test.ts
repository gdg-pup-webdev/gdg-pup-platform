// import { describe, it, expect, beforeEach } from "vitest";
// import { MockGdgMemberRepository } from "../infrastructure/MockGdgMemberRepository";
// import { GdgMembersController } from "../GdgMembersController";
// import { AddGdgMember } from "../useCases/AddGdgMember";
// import { UpdateMemberByGdgId } from "../useCases/UpdateMemberByGdgId";
// import { DeleteGdgMember } from "../useCases/DeleteGdgMember";
// import { GetOneGdgMember } from "../useCases/GetOneGdgMember";
// import { ListGdgMembers } from "../useCases/ListGdgMembers";
// import { ImportGdgMembersFromCsv } from "../useCases/ImportGdgMembersFromCsv";
// import { ExportGdgMembersToCsv } from "../useCases/ExportGdgMembersToCsv";
// import { FindMemberByGdgId } from "../useCases/FindMemberByGdgId";
// import { FindMemberByEmail } from "../useCases/FindMemberByEmail";

// describe("GdgMembersController", () => {
//   let controller: GdgMembersController;
//   let repo: MockGdgMemberRepository;

//   beforeEach(() => {
//     repo = new MockGdgMemberRepository();
//     controller = new GdgMembersController(
//       new AddGdgMember(repo),
//       new UpdateMemberByGdgId(repo),
//       new DeleteGdgMember(repo),
//       new GetOneGdgMember(repo),
//       new ListGdgMembers(repo),
//       new ImportGdgMembersFromCsv(repo),
//       new ExportGdgMembersToCsv(repo),
//       new FindMemberByGdgId(repo),
//       new FindMemberByEmail(repo)
//     );
//   });

//   it("should add and then get a member", async () => {
//     const memberData = {
//       gdgId: "GDG-001",
//       email: "test@example.com",
//       program: "BSCS",
//       department: "SCIS",
//       displayName: "Test User",
//       firstName: "Test",
//       lastName: "User",
//       suffix: null,
//     };

//     const added = await controller.addMember(memberData);
//     const fetched = await controller.getOne(added.id);

//     expect(fetched).toEqual(added);
//     expect(fetched?.email).toBe(memberData.email);
//   });

//   it("should find a member by gdgId via controller", async () => {
//     const memberData = {
//       gdgId: "GDG-UNIQUE-ID",
//       email: "unique@example.com",
//       program: "BSCS",
//       department: "SCIS",
//       displayName: "Unique User",
//       firstName: "Unique",
//       lastName: "User",
//       suffix: null,
//     };

//     await controller.addMember(memberData);
//     const fetched = await controller.findByGdgId("GDG-UNIQUE-ID");

//     expect(fetched).not.toBeNull();
//     expect(fetched?.gdgId).toBe("GDG-UNIQUE-ID");
//   });

//   it("should list members", async () => {
//     await controller.addMember({ gdgId: "1", email: "1@a.com", program: "A", department: "D", displayName: "N", firstName: "F", lastName: "L", suffix: null });
//     await controller.addMember({ gdgId: "2", email: "2@a.com", program: "A", department: "D", displayName: "N", firstName: "F", lastName: "L", suffix: null });

//     const result = await controller.list(1, 10);
//     expect(result.count).toBe(2);
//     expect(result.list.length).toBe(2);
//   });
// });
