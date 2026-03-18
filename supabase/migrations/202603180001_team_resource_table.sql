-- team_resource table migration
CREATE TABLE IF NOT EXISTS public.team_resource (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_link TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  thumbnail_storage_reference TEXT NOT NULL,
  thumbnail_public_url TEXT NOT NULL,
  team_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_resource ENABLE ROW LEVEL SECURITY;

-- Simple permissive policy for now (matching others in prototype)
CREATE POLICY "Enable all for everyone" ON public.team_resource
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_team_resource_team_name ON public.team_resource(team_name);
CREATE INDEX IF NOT EXISTS idx_team_resource_type ON public.team_resource(resource_type);
