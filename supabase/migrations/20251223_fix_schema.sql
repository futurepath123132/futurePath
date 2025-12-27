-- Add ranking columns
ALTER TABLE public.universities
ADD COLUMN IF NOT EXISTS hec_recognized BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scimago_ranking TEXT,
ADD COLUMN IF NOT EXISTS qs_ranking TEXT;

-- Remove credit_hours column if it exists
ALTER TABLE public.universities
DROP COLUMN IF EXISTS credit_hours;

-- Force a schema cache reload (sometimes needed)
NOTIFY pgrst, 'reload config';
