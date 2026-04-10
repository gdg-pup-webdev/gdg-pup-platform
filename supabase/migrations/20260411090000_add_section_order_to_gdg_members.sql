ALTER TABLE public.gdg_members
ADD COLUMN IF NOT EXISTS section_order text;

UPDATE public.gdg_members
SET section_order = 'customButtons,skillsAndInterests,projects,gdgImpact,badges'
WHERE section_order IS NULL OR btrim(section_order) = '';
