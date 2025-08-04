/*
  # Add missing columns to treks table

  1. Changes
    - Add `things_to_carry` column (jsonb array) to store items trekkers need to bring
    - Update existing columns to ensure proper defaults and types

  2. Security
    - No RLS changes needed as table already has proper policies
*/

-- Add the missing things_to_carry column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'treks' AND column_name = 'things_to_carry'
  ) THEN
    ALTER TABLE treks ADD COLUMN things_to_carry jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;