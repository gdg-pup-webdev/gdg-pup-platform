import { cz } from "@packages/typed-rest/shared";
import { teamMemberInsertDTO, teamMember } from "./member.js";

export const gdgTeam = cz.object({
  id: cz.string(),
  name: cz.string(),
  description: cz.string(),
  responsibilities: cz.string().nullable(),
  parent_team_id: cz.string().nullable(),
  members: cz.array(teamMember),
});

export const gdgTeamInsertDTO = gdgTeam
  .omit({
    id: true,
    members: true,
    responsibilities: true,
    parent_team_id: true,
  })
  .extend({
    responsibilities: cz.string().nullish(),
    parent_team_id: cz.string().nullish(),
    members: cz.array(teamMemberInsertDTO).optional(),
  });

export const gdgTeamUpdateDTO = gdgTeamInsertDTO.partial();
