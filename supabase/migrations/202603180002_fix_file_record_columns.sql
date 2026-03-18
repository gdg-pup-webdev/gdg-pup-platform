-- Add missing metadata columns to file_record table
ALTER TABLE public.file_record 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add index for the order by clause in listPaginated
CREATE INDEX IF NOT EXISTS idx_file_record_created_at ON public.file_record(created_at DESC);
