-- Manual rollback for similarity-query index optimization.
-- Use this only if you need to revert the index changes introduced in:
-- supabase/migrations/20260411213000_optimize_gdg_members_similarity_query_indexes.sql

DROP INDEX IF EXISTS public.idx_gdg_members_public_tools_and_technologies_trgm;
DROP INDEX IF EXISTS public.idx_gdg_members_public_learning_interests_trgm;
DROP INDEX IF EXISTS public.idx_gdg_members_public_technical_skills_trgm;
DROP INDEX IF EXISTS public.idx_gdg_members_public_sort_name;
DROP INDEX IF EXISTS public.idx_gdg_members_public_year_level;
DROP INDEX IF EXISTS public.idx_gdg_members_public_department;
DROP INDEX IF EXISTS public.idx_gdg_members_public_program;

-- Optional: only run this if you are sure pg_trgm is not used elsewhere.
-- DROP EXTENSION IF EXISTS pg_trgm;
    