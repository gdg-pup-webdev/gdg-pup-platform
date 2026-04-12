ALTER TABLE public.member_projects
ADD COLUMN IF NOT EXISTS position integer;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "memberGdgId"
      ORDER BY "createdAt", id
    ) - 1 AS next_position
  FROM public.member_projects
)
UPDATE public.member_projects target
SET position = ranked.next_position
FROM ranked
WHERE ranked.id = target.id
  AND target.position IS NULL;

UPDATE public.member_projects
SET position = 0
WHERE position IS NULL;

ALTER TABLE public.member_projects
ALTER COLUMN position SET NOT NULL;

ALTER TABLE public.member_projects
ALTER COLUMN position SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_member_projects_member_position
ON public.member_projects ("memberGdgId", position);
