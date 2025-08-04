/*
  # Fix Enquiries RLS Policies

  1. Security Updates
    - Drop existing problematic policies that reference auth.users table
    - Create new policies that use auth.email() function instead
    - Ensure proper access control for enquiries table

  2. Policy Changes
    - Allow public to insert enquiries (for contact forms)
    - Allow admin to read all enquiries using auth.email()
    - Allow admin to update enquiry status
    - Remove direct references to users table
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Admins can read all enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can update enquiry status" ON public.enquiries;
DROP POLICY IF EXISTS "Anyone can create enquiries" ON public.enquiries;

-- Create new policies that don't reference auth.users table directly
CREATE POLICY "Allow public to create enquiries"
  ON public.enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow admin to read all enquiries"
  ON public.enquiries
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@trekzone.com');

CREATE POLICY "Allow admin to update enquiries"
  ON public.enquiries
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'admin@trekzone.com')
  WITH CHECK (auth.email() = 'admin@trekzone.com');

CREATE POLICY "Allow admin to delete enquiries"
  ON public.enquiries
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'admin@trekzone.com');