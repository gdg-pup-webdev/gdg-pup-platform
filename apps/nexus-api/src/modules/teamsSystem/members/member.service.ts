import { models } from "@packages/nexus-api-contracts";
import { tryCatch } from "@/utils/tryCatch.util.js";
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
    const { data, error } = await tryCatch(
      async () => await this.memberRepository.listMembersOfTeam(teamId),
      "listing members",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  listMembersWithFilter = async (
    pageNumber: number,
    pageSize: number,
    filters: { teamId?: string; userId?: string; role?: string },
  ) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.memberRepository.listMembersWithFilter(
          pageNumber,
          pageSize,
          filters,
        ),
      "listing members",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  createMember = async (dto: memberInserDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.memberRepository.createMember(dto),
      "creating member",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  deleteMember = async (memberId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.memberRepository.deleteMember(memberId),
      "deleting member",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };
}

export const memberServiceInstance = new MemberService();
