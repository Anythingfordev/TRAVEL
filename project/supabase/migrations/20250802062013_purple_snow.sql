/*
  # Create enquiries table

  1. New Tables
    - `enquiries`
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `message` (text, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `enquiries` table
    - Add policy for users to create enquiries
    - Add policy for admins to read all enquiries
    - Add policy for admins to update enquiry status

  3. Indexes
    - Add index on trek_id for faster queries
    - Add index on status for filtering
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid REFERENCES treks(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_enquiries_trek_id ON enquiries(trek_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- Policies
CREATE POLICY "Anyone can create enquiries"
  ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read all enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@trekzone.com'
    )
  );

CREATE POLICY "Admins can update enquiry status"
  ON enquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@trekzone.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@trekzone.com'
    )
  );