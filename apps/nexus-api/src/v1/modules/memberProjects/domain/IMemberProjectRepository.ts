import { MemberProject } from "./MemberProject";

export abstract class IMemberProjectRepository {
  abstract saveNew(memberProject: MemberProject): Promise<MemberProject>;
  abstract persistUpdates(memberProject: MemberProject): Promise<MemberProject>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<MemberProject | null>;
  abstract findAll(page: number, limit: number): Promise<{ list: MemberProject[]; count: number }>;
  abstract findByMemberGdgId(memberGdgId: string, page: number, limit: number): Promise<{ list: MemberProject[]; count: number }>;
  abstract search(query: string, page: number, limit: number): Promise<{ list: MemberProject[]; count: number }>;
  abstract findRandom(page: number, limit: number): Promise<{ list: MemberProject[]; count: number }>;
}
