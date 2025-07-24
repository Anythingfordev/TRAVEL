/*
  # Enhanced Treks Table with Inclusions, Exclusions, and Itinerary

  1. New Tables
    - Enhanced `treks` table with additional fields:
      - `inclusions` (text array) - What's included in the trek package
      - `exclusions` (text array) - What's not included in the trek package  
      - `itinerary` (jsonb) - Detailed day-by-day itinerary with activities

  2. Security
    - Enable RLS on `treks` table
    - Add policies for authenticated users to manage their own treks
    - Public read access for all treks

  3. Changes
    - Drop existing treks table if exists
    - Create new enhanced treks table with all required fields
    - Set up proper constraints and defaults
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS treks CASCADE;

-- Create enhanced treks table
CREATE TABLE treks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty = ANY (ARRAY['Easy'::text, 'Moderate'::text, 'Hard'::text, 'Expert'::text])),
  price numeric NOT NULL DEFAULT 0,
  image_url text DEFAULT 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_participants integer DEFAULT 20,
  current_participants integer DEFAULT 0,
  inclusions text[] DEFAULT '{}',
  exclusions text[] DEFAULT '{}',
  itinerary jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE treks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Treks are viewable by everyone"
  ON treks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create treks"
  ON treks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own treks"
  ON treks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own treks"
  ON treks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX idx_treks_start_date ON treks(start_date);
CREATE INDEX idx_treks_difficulty ON treks(difficulty);
CREATE INDEX idx_treks_created_by ON treks(created_by);