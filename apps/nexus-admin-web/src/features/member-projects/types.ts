import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// Types inferred from contract models
export type MemberProject = z.infer<typeof contract.api.v1.member_projects.GET.response[200]>["data"][number];
export type MemberProjectsResponse = z.infer<typeof contract.api.v1.member_projects.GET.response[200]>;

export type CreateMemberProjectDTO = z.infer<typeof contract.api.v1.member_projects.POST.body>["data"];
export type UpdateMemberProjectDTO = z.infer<typeof contract.api.v1.member_projects.id.PATCH.body>["data"];

export class MemberProjectsException extends Error {
  constructor(
    public message: string,
    public code: string = "MEMBER_PROJECTS_ERROR",
    public detail?: string
  ) {
    super(message);
    this.name = "MemberProjectsException";
  }
}
