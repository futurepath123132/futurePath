-- Migration to convert programs from text[] to jsonb
-- This will preserve existing program names and set URLs to empty strings

-- Step 1: Add a temporary column for the new jsonb data
ALTER TABLE universities ADD COLUMN programs_new jsonb;

-- Step 2: Migrate existing data
UPDATE universities
SET programs_new = (
    SELECT jsonb_agg(
        jsonb_build_object('name', program_name, 'url', '')
    )
    FROM unnest(programs) AS program_name
)
WHERE programs IS NOT NULL AND array_length(programs, 1) > 0;

-- Step 3: Set programs_new to empty array for rows with no programs
UPDATE universities
SET programs_new = '[]'::jsonb
WHERE programs IS NULL OR array_length(programs, 1) IS NULL;

-- Step 4: Drop the old column
ALTER TABLE universities DROP COLUMN programs;

-- Step 5: Rename the new column
ALTER TABLE universities RENAME COLUMN programs_new TO programs;

-- Step 6: Set default value for new rows
ALTER TABLE universities ALTER COLUMN programs SET DEFAULT '[]'::jsonb;
