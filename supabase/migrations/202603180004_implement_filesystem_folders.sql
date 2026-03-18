-- Implement folders in filesystem
CREATE TABLE IF NOT EXISTS public.filesystem_folder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.filesystem_folder(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique index for folder name within a parent (cannot have two folders with same name in same folder)
CREATE UNIQUE INDEX IF NOT EXISTS idx_folder_name_parent ON public.filesystem_folder(name, parent_id) WHERE parent_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_folder_name_root ON public.filesystem_folder(name) WHERE parent_id IS NULL;

-- Update file_record table
ALTER TABLE public.file_record 
DROP COLUMN IF EXISTS file_path,
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.filesystem_folder(id) ON DELETE SET NULL;

-- Index for efficient folder listing
CREATE INDEX IF NOT EXISTS idx_file_record_folder_id ON public.file_record(folder_id);

-- Enable RLS for filesystem_folder (matching prototype patterns)
ALTER TABLE public.filesystem_folder ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for everyone" ON public.filesystem_folder
  FOR ALL
  USING (true)
  WITH CHECK (true);
