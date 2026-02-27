import { models } from "@packages/nexus-api-contracts";
import { tryCatch_deprecated } from "@/v0/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/v0/deprecated/classes/ServerError_DEPRECATED.js";
import {
  MemberRepository,
  memberRepositoryInstance,
} from "./member.repository.js";
import {
  TablesInsert,
  TablesUpdate,
} from "@/v0/types/supabase.types.js";

type insertDTO = TablesInsert<"team">;
type updateDTO = TablesUpdate<"team">;
type memberInserDTO = TablesInsert<"team_member">;
type memberUpdateDTO = TablesUpdate<"team_member">;

export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository = memberRepositoryInstance,
  ) {}

  listMembersOfTeam = async (teamId: string) => {
    return await this.memberRepository.listMembersOfTeam(teamId);
  };

  listMembersWithFilter = async (
    pageNumber: number,
    pageSize: number,
    filters: { teamId?: string; userId?: string; role?: string },
  ) => {
    return await this.memberRepository.listMembersWithFilter(
      pageNumber,
      pageSize,
      filters,
    );
  };

  createMember = async (dto: memberInserDTO) => {
    return await this.memberRepository.createMember(dto);
  };

  deleteMember = async (memberId: string) => {
    return await this.memberRepository.deleteMember(memberId);
  };
}

export const memberServiceInstance = new MemberService();
