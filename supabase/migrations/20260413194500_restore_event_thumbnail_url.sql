ALTER TABLE "public"."event"
ADD COLUMN IF NOT EXISTS "thumbnail_url" text;

UPDATE "public"."event" AS e
SET "thumbnail_url" = img."imageUrl"
FROM LATERAL (
  SELECT "imageUrl"
  FROM "public"."event_images"
  WHERE "eventId" = e."id"
  ORDER BY "position" ASC
  LIMIT 1
) AS img
WHERE (e."thumbnail_url" IS NULL OR btrim(e."thumbnail_url") = '')
  AND img."imageUrl" IS NOT NULL;
