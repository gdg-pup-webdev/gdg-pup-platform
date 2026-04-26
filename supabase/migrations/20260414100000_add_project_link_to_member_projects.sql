ALTER TABLE public.member_projects
ADD COLUMN IF NOT EXISTS "projectLink" text;
