-- Add submission_proof_url column to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS submission_proof_url TEXT;

-- Policy to ensure users can only see their own application proofs (if stored as paths, though we use signed URLs for now)
-- Storage policy should be handled in the storage bucket setup.
