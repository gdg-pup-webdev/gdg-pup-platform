import { cz } from "@packages/typed-rest/shared";

/** Represents a full certificate record from the database. */
export const certificateRow = cz.object({
  id: cz.string(),
  user_id: cz.string(),

  title: cz.string(),
  description: cz.string(),
  image_url: cz.string(),
});

/** Data Transfer Object for creating a new certificate. */
export const certificateInsertDTO = certificateRow.omit({
  id: true,
  user_id: true,
  image_url: true,
});

/** Data Transfer Object for updating an existing certificate. */
export const certificateUpdateDTO = certificateRow.partial();
