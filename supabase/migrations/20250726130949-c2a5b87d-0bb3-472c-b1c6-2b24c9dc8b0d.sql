-- Phase 1: Database Security Hardening
-- Re-enable RLS and implement proper security policies

-- Re-enable RLS on all tables
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coolies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Add missing user_id column to passengers and coolies to link to auth.users
ALTER TABLE public.passengers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.coolies ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key relationships for bookings
ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_passenger FOREIGN KEY (passenger_id) REFERENCES public.passengers(id) ON DELETE CASCADE;
ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_coolie FOREIGN KEY (coolie_id) REFERENCES public.coolies(id) ON DELETE SET NULL;
ALTER TABLE public.feedback ADD CONSTRAINT fk_feedback_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'passenger', 'coolie');

-- Update profiles table to use the role enum
ALTER TABLE public.profiles ALTER COLUMN role TYPE app_role USING role::app_role;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role('admin'));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for passengers
DROP POLICY IF EXISTS "Passengers can view their own data" ON public.passengers;
DROP POLICY IF EXISTS "Passengers can insert their own data" ON public.passengers;

CREATE POLICY "Passengers can view their own data" ON public.passengers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all passengers" ON public.passengers
  FOR SELECT USING (public.has_role('admin'));

CREATE POLICY "Passengers can insert their own data" ON public.passengers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Passengers can update their own data" ON public.passengers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for coolies
DROP POLICY IF EXISTS "Coolies can view their own data" ON public.coolies;
DROP POLICY IF EXISTS "Coolies can insert their own data" ON public.coolies;
DROP POLICY IF EXISTS "Coolies can update their own data" ON public.coolies;

CREATE POLICY "Coolies can view their own data" ON public.coolies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coolies" ON public.coolies
  FOR SELECT USING (public.has_role('admin'));

CREATE POLICY "System can view available coolies" ON public.coolies
  FOR SELECT USING (is_available = true);

CREATE POLICY "Coolies can insert their own data" ON public.coolies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coolies can update their own data" ON public.coolies
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bookings
CREATE POLICY "Passengers can view their own bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.passengers 
      WHERE passengers.id = bookings.passenger_id 
      AND passengers.user_id = auth.uid()
    )
  );

CREATE POLICY "Coolies can view their assigned bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.coolies 
      WHERE coolies.id = bookings.coolie_id 
      AND coolies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (public.has_role('admin'));

CREATE POLICY "Passengers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.passengers 
      WHERE passengers.id = passenger_id 
      AND passengers.user_id = auth.uid()
    )
  );

CREATE POLICY "System can update bookings for coolie assignment" ON public.bookings
  FOR UPDATE USING (true);

-- RLS Policies for feedback
CREATE POLICY "Users can view feedback for their bookings" ON public.feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.passengers p ON b.passenger_id = p.id
      WHERE b.id = feedback.booking_id 
      AND p.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.coolies c ON b.coolie_id = c.id
      WHERE b.id = feedback.booking_id 
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Passengers can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.passengers p ON b.passenger_id = p.id
      WHERE b.id = booking_id 
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (public.has_role('admin'));

-- Add input validation constraints
ALTER TABLE public.bookings ADD CONSTRAINT check_positive_weight CHECK (weight > 0);
ALTER TABLE public.bookings ADD CONSTRAINT check_positive_fare CHECK (fare >= 0);
ALTER TABLE public.bookings ADD CONSTRAINT check_valid_luggage_type CHECK (luggage_type IN ('light', 'medium', 'heavy'));
ALTER TABLE public.bookings ADD CONSTRAINT check_valid_status CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled'));
ALTER TABLE public.coolies ADD CONSTRAINT check_non_negative_earnings CHECK (earnings >= 0);
ALTER TABLE public.feedback ADD CONSTRAINT check_valid_rating CHECK (rating BETWEEN 1 AND 5);

-- Create audit log table for sensitive operations
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role('admin'));