-- Implement folders in filesystem
CREATE TABLE IF NOT EXISTS public.filesystem_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.filesystem_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique index for folder name within a parent (cannot have two folders with same name in same folder)
CREATE UNIQUE INDEX IF NOT EXISTS idx_folder_name_parent ON public.filesystem_folders(name, parent_id) WHERE parent_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_folder_name_root ON public.filesystem_folders(name) WHERE parent_id IS NULL;

-- Update file_record table
ALTER TABLE public.file_record 
DROP COLUMN IF EXISTS file_path,
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.filesystem_folders(id) ON DELETE SET NULL;

-- Index for efficient folder listing
CREATE INDEX IF NOT EXISTS idx_file_record_folder_id ON public.file_record(folder_id);

-- Enable RLS for filesystem_folders (matching prototype patterns)
ALTER TABLE public.filesystem_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for everyone" ON public.filesystem_folders
  FOR ALL
  USING (true)
  WITH CHECK (true);
