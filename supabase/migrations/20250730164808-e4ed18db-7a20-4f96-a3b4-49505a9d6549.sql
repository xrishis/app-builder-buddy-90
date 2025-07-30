-- Fix security linter warnings

-- Fix function search_path for security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'passenger')::app_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Fix anonymous access policies by restricting to authenticated users only
-- Update all policies to require authenticated users

-- Profiles policies - restrict to authenticated only
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role('admin'));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Passengers policies - restrict to authenticated only
DROP POLICY IF EXISTS "Passengers can view their own data" ON public.passengers;
DROP POLICY IF EXISTS "Admins can view all passengers" ON public.passengers;
DROP POLICY IF EXISTS "Passengers can insert their own data" ON public.passengers;
DROP POLICY IF EXISTS "Passengers can update their own data" ON public.passengers;

CREATE POLICY "Passengers can view their own data" ON public.passengers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all passengers" ON public.passengers
  FOR SELECT TO authenticated USING (public.has_role('admin'));

CREATE POLICY "Passengers can insert their own data" ON public.passengers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Passengers can update their own data" ON public.passengers
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Coolies policies - restrict to authenticated only
DROP POLICY IF EXISTS "Coolies can view their own data" ON public.coolies;
DROP POLICY IF EXISTS "Admins can view all coolies" ON public.coolies;
DROP POLICY IF EXISTS "System can view available coolies" ON public.coolies;
DROP POLICY IF EXISTS "Coolies can insert their own data" ON public.coolies;
DROP POLICY IF EXISTS "Coolies can update their own data" ON public.coolies;

CREATE POLICY "Coolies can view their own data" ON public.coolies
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coolies" ON public.coolies
  FOR SELECT TO authenticated USING (public.has_role('admin'));

CREATE POLICY "Service role can view available coolies" ON public.coolies
  FOR SELECT TO service_role USING (is_available = true);

CREATE POLICY "Coolies can insert their own data" ON public.coolies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coolies can update their own data" ON public.coolies
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Bookings policies - restrict to authenticated only
DROP POLICY IF EXISTS "Passengers can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Coolies can view their assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Passengers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "System can update bookings for coolie assignment" ON public.bookings;

CREATE POLICY "Passengers can view their own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.passengers 
      WHERE passengers.id = bookings.passenger_id 
      AND passengers.user_id = auth.uid()
    )
  );

CREATE POLICY "Coolies can view their assigned bookings" ON public.bookings
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.coolies 
      WHERE coolies.id = bookings.coolie_id 
      AND coolies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.has_role('admin'));

CREATE POLICY "Passengers can create bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.passengers 
      WHERE passengers.id = passenger_id 
      AND passengers.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can update bookings" ON public.bookings
  FOR UPDATE TO service_role USING (true);

-- Feedback policies - restrict to authenticated only
DROP POLICY IF EXISTS "Users can view feedback for their bookings" ON public.feedback;
DROP POLICY IF EXISTS "Passengers can create feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

CREATE POLICY "Users can view feedback for their bookings" ON public.feedback
  FOR SELECT TO authenticated USING (
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
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.passengers p ON b.passenger_id = p.id
      WHERE b.id = booking_id 
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT TO authenticated USING (public.has_role('admin'));

-- Audit logs policy - restrict to authenticated only
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.audit_logs;

CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.has_role('admin'));

-- Stations can remain public for now as it's reference data
-- But let's update it to be more explicit
DROP POLICY IF EXISTS "Everyone can view stations" ON public.stations;

CREATE POLICY "Public can view stations" ON public.stations
  FOR SELECT TO public USING (true);