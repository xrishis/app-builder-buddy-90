-- Update passengers table to match new schema
DROP TABLE IF EXISTS passengers CASCADE;
CREATE TABLE passengers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pnr text UNIQUE NOT NULL,
  name text,
  coach text,
  seat text,
  train_number text,
  created_at timestamp with time zone DEFAULT now()
);

-- Update coolies table to match new schema
DROP TABLE IF EXISTS coolies CASCADE;
CREATE TABLE coolies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  name text,
  aadhar_url text,
  is_available boolean DEFAULT false,
  earnings numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Update profiles table to reference auth.users properly
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on all tables
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coolies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for passengers
CREATE POLICY "Passengers can view their own data" ON passengers
  FOR SELECT USING (true); -- Public for PNR verification

CREATE POLICY "Passengers can insert their own data" ON passengers
  FOR INSERT WITH CHECK (true); -- Allow PNR registration

-- Create RLS policies for coolies
CREATE POLICY "Coolies can view their own data" ON coolies
  FOR SELECT USING (true); -- Public for availability check

CREATE POLICY "Coolies can insert their own data" ON coolies
  FOR INSERT WITH CHECK (true); -- Allow registration

CREATE POLICY "Coolies can update their own data" ON coolies
  FOR UPDATE USING (true); -- Allow status updates

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);