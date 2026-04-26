-- Speed up suggested-members query without changing filtering behavior.
-- Supports OR-based exact matches, wildcard ILIKE clauses, and stable ordering.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_program
  ON public.gdg_members (program)
  WHERE is_public = true AND program IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_department
  ON public.gdg_members (department)
  WHERE is_public = true AND department IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_year_level
  ON public.gdg_members (year_level)
  WHERE is_public = true AND year_level IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_sort_name
  ON public.gdg_members (display_name, first_name, gdg_id)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_technical_skills_trgm
  ON public.gdg_members USING gin (technical_skills gin_trgm_ops)
  WHERE is_public = true AND technical_skills IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_learning_interests_trgm
  ON public.gdg_members USING gin (learning_interests gin_trgm_ops)
  WHERE is_public = true AND learning_interests IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gdg_members_public_tools_and_technologies_trgm
  ON public.gdg_members USING gin (tools_and_technologies gin_trgm_ops)
  WHERE is_public = true AND tools_and_technologies IS NOT NULL;
