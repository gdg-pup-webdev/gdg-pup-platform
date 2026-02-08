import { models } from "@packages/nexus-api-contracts";
import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import {
  MemberRepository,
  memberRepositoryInstance,
} from "./member.repository.js";

type insertDTO = models.teamSystem.team.insert;
type updateDTO = models.teamSystem.team.update;
type memberInserDTO = models.teamSystem.member.insert;
type memberUpdateDTO = models.teamSystem.member.update;

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
