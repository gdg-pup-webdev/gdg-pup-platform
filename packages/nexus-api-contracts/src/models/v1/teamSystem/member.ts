import { cz } from "@packages/typed-rest/shared";

export const teamMember = cz.object({
  id: cz.string(),
  team_id: cz.string(),
  user_id: cz.string(),
  name: cz.string(),
  position: cz.string(),
  image: cz.string().nullable(),
});

export const teamMemberInsertDTO = teamMember.omit({
  id: true,
  name: true,
  image: true,
  team_id: true,
});
export const teamMemberUpdateDTO = teamMemberInsertDTO.partial();
