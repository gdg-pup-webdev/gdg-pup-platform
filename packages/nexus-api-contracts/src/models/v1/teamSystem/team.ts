import { cz } from "@packages/typed-rest/shared";
import { teamMemberInsertDTO, teamMember } from "./member.js";

export const gdgTeam = cz.object({
  id: cz.string(),
  name: cz.string(),
  description: cz.string(),
  members: cz.array(teamMember),
});

export const gdgTeamInsertDTO = gdgTeam.omit({
  id: true,
  members: true,
}).extend({
  members: cz.array(teamMemberInsertDTO).optional(),
});

export const gdgTeamUpdateDTO = gdgTeamInsertDTO.partial();
