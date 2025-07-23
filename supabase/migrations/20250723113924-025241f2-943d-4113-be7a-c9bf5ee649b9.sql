-- Create profiles table for user roles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('passenger', 'coolie', 'admin')),
  phone TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stations table
CREATE TABLE public.stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create passengers table
CREATE TABLE public.passengers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coolies table
CREATE TABLE public.coolies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  station_id UUID REFERENCES public.stations(id),
  aadhar_url TEXT,
  kyc_verified BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  earnings FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_id UUID NOT NULL REFERENCES public.passengers(id) ON DELETE CASCADE,
  coolie_id UUID REFERENCES public.coolies(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  luggage_type TEXT NOT NULL,
  weight FLOAT NOT NULL,
  fare FLOAT,
  booking_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  platform_number INTEGER,
  train_number TEXT,
  payment_method TEXT CHECK (payment_method IN ('UPI', 'card', 'wallet', 'cash')),
  is_paid BOOLEAN NOT NULL DEFAULT false,
  completion_pin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coolies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for stations (public read access)
CREATE POLICY "Everyone can view stations" ON public.stations
  FOR SELECT USING (true);

-- Create RLS policies for passengers
CREATE POLICY "Passengers can view their own data" ON public.passengers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Passengers can update their own data" ON public.passengers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Passengers can insert their own data" ON public.passengers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for coolies
CREATE POLICY "Coolies can view their own data" ON public.coolies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coolies can update their own data" ON public.coolies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Coolies can insert their own data" ON public.coolies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view available coolies" ON public.coolies
  FOR SELECT USING (is_available = true AND kyc_verified = true);

-- Create RLS policies for bookings
CREATE POLICY "Passengers can view their bookings" ON public.bookings
  FOR SELECT USING (
    passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid())
  );

CREATE POLICY "Coolies can view their bookings" ON public.bookings
  FOR SELECT USING (
    coolie_id IN (SELECT id FROM public.coolies WHERE user_id = auth.uid())
  );

CREATE POLICY "Passengers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid())
  );

CREATE POLICY "Coolies can update their bookings" ON public.bookings
  FOR UPDATE USING (
    coolie_id IN (SELECT id FROM public.coolies WHERE user_id = auth.uid())
  );

-- Create RLS policies for feedback
CREATE POLICY "Users can view feedback for their bookings" ON public.feedback
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid())
      OR coolie_id IN (SELECT id FROM public.coolies WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Passengers can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid())
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, phone, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'passenger'),
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample stations
INSERT INTO public.stations (name, code, location) VALUES
  ('New Delhi Railway Station', 'NDLS', 'New Delhi'),
  ('Mumbai Central', 'BCT', 'Mumbai'),
  ('Howrah Junction', 'HWH', 'Kolkata'),
  ('Chennai Central', 'MAS', 'Chennai'),
  ('Bangalore City Junction', 'SBC', 'Bangalore');