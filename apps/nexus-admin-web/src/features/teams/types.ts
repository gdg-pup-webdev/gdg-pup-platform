import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// We extract types from the contract if possible, or define them here based on the contract models
// Based on packages/nexus-api-contracts/src/models/v1/teamSystem/team.ts

export type Team = {
  id: string;
  name: string;
  description: string;
  responsibilities: string | null;
  parent_team_id: string | null;
  members?: any[]; // We'll keep it simple for now
};

export type TeamInsert = {
  name: string;
  description: string;
  responsibilities?: string | null;
  parent_team_id?: string | null;
};

export type TeamUpdate = Partial<TeamInsert>;
