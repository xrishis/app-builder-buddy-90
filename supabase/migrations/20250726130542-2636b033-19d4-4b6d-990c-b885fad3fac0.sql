-- Disable RLS on tables to allow unauthenticated access for dummy data
ALTER TABLE public.passengers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coolies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;