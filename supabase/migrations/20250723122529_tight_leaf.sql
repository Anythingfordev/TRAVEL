/*
  # Add Things to Carry Field

  1. Changes
    - Add `things_to_carry` column to `treks` table
    - Set default value as empty array
    - Update existing records to have empty array

  2. Security
    - No changes to RLS policies needed
*/

-- Add things_to_carry column to treks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'treks' AND column_name = 'things_to_carry'
  ) THEN
    ALTER TABLE treks ADD COLUMN things_to_carry text[] DEFAULT '{}';
  END IF;
END $$;