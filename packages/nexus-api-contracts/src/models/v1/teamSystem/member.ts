import { cz } from "@packages/typed-rest/shared";

export const teamMember = cz.object({
  id: cz.string(),
  role: cz.string(),
  team_id: cz.string(),
  user_id: cz.string(),
  name: cz.string(),
  avatar_url: cz.string(),
});

export const teamMemberInsertDTO = teamMember.omit({
  id: true,
  avatar_url: true,
});
export const teamMemberUpdateDTO = teamMemberInsertDTO.partial();
