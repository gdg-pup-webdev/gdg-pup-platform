import { cz } from "@packages/typed-rest/shared";

export const gdgTeam = cz.object({
  id: cz.string(),
  name: cz.string(),
  description: cz.string(),
});

export const gdgTeamInsertDTO = gdgTeam.omit({
  id: true,
});

export const gdgTeamUpdateDTO = gdgTeamInsertDTO.partial();
