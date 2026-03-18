-- Add file_type column to file_record table
ALTER TABLE public.file_record 
ADD COLUMN IF NOT EXISTS file_type TEXT NOT NULL DEFAULT '';
