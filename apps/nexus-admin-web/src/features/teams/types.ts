import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// We extract types from the contract if possible, or define them here based on the contract models
// Based on packages/nexus-api-contracts/src/models/v1/teamSystem/team.ts

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  name: string;
  position: string;
  image: string | null;
};

export type TeamMemberInsert = {
  user_id: string;
  position: string;
};

export type TeamMemberUpdate = Partial<TeamMemberInsert>;

export type Team = {
  id: string;
  name: string;
  description: string;
  responsibilities: string | null;
  parent_team_id: string | null;
  members: TeamMember[];
};

export type TeamInsert = {
  name: string;
  description: string;
  responsibilities?: string | null;
  parent_team_id?: string | null;
};

export type TeamUpdate = Partial<TeamInsert>;



export type UserProfile = contract.api.v1.gdgmembers.GET.response[200]["data"][number];