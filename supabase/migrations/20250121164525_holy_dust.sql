/*
  # Create bills table

  1. New Tables
    - `bills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `amount` (numeric)
      - `due_date` (timestamptz)
      - `status` (text)
      - `category` (text)
      - `is_recurring` (boolean)
      - `paid_amount` (numeric)
      - `recurring_day` (integer)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `bills` table
    - Add policies for authenticated users to:
      - Read their own bills
      - Create new bills
      - Update their own bills
      - Delete their own bills
*/

CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  amount numeric NOT NULL,
  due_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('PAID', 'PARTIALLY_PAID', 'UNPAID')),
  category text NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  paid_amount numeric,
  recurring_day integer,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own bills
CREATE POLICY "Users can read own bills"
  ON bills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own bills
CREATE POLICY "Users can create bills"
  ON bills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own bills
CREATE POLICY "Users can update own bills"
  ON bills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own bills
CREATE POLICY "Users can delete own bills"
  ON bills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);