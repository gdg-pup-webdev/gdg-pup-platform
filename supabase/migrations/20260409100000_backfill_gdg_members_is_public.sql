-- Backfill and normalize profile visibility for suggested-user eligibility.
-- 1) Existing null rows become public by default.
-- 2) Future rows default to public.
-- 3) Column becomes non-null to prevent accidental exclusion.

UPDATE public.gdg_members
SET is_public = true
WHERE is_public IS NULL;

ALTER TABLE public.gdg_members
ALTER COLUMN is_public SET DEFAULT true;

ALTER TABLE public.gdg_members
ALTER COLUMN is_public SET NOT NULL;
