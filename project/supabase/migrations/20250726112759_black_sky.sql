/*
  # Create Categories System

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `title` (text, unique)
      - `description` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `created_by` (uuid, foreign key to users)
    
    - `trek_categories` (junction table)
      - `id` (uuid, primary key)
      - `trek_id` (uuid, foreign key to treks)
      - `category_id` (uuid, foreign key to categories)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage categories
    - Add policies for public to read active categories

  3. Indexes
    - Add indexes for better query performance
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text UNIQUE NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create trek_categories junction table
CREATE TABLE IF NOT EXISTS trek_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid REFERENCES treks(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trek_id, category_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE trek_categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Trek categories policies
CREATE POLICY "Trek categories are viewable by everyone"
  ON trek_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage trek categories"
  ON trek_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_created_by ON categories(created_by);
CREATE INDEX IF NOT EXISTS idx_trek_categories_trek_id ON trek_categories(trek_id);
CREATE INDEX IF NOT EXISTS idx_trek_categories_category_id ON trek_categories(category_id);