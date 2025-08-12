-- Drop and recreate users table to fix ID generation issues
create extension if not exists pgcrypto;

-- First, drop all dependent objects
DROP TRIGGER IF EXISTS on_user_role_assignment ON public.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP FUNCTION IF EXISTS public.handle_user_role_assignment();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Drop the users table
DROP TABLE IF EXISTS public.users CASCADE;

-- Recreate users table with proper UUID generation
  CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT,
  whatsapp TEXT,
  date_naissance DATE,
  adresse TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'conseillere', 'admin')),
  code_client TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle user role assignment
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure role is properly set and not overridden
  IF NEW.role IS NULL THEN
    NEW.role := 'client';
  END IF;
  
  -- Generate appropriate code_client if not set
  IF NEW.code_client IS NULL THEN
    NEW.code_client := CASE 
      WHEN NEW.role = 'admin' THEN 'ADM' || EXTRACT(EPOCH FROM NOW())::text
      WHEN NEW.role = 'conseillere' THEN 'CNS' || EXTRACT(EPOCH FROM NOW())::text
      ELSE 'C' || EXTRACT(EPOCH FROM NOW())::text
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

  -- Create trigger to handle role assignment
  do $$
  begin
    if not exists (
      select 1 from pg_trigger where tgname = 'on_user_role_assignment'
    ) then
      create trigger on_user_role_assignment
        before insert or update on public.users
        for each row execute function public.handle_user_role_assignment();
    end if;
  end $$;

-- Create function for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

  -- Create trigger for automatic timestamps
  do $$
  begin
    if not exists (
      select 1 from pg_trigger where tgname = 'update_users_updated_at'
    ) then
      create trigger update_users_updated_at
        before update on public.users
        for each row execute function update_updated_at_column();
    end if;
  end $$;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to manage all users (for admin functions)
CREATE POLICY "Service role can manage all users" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_code_client ON public.users(code_client);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

  -- Enable realtime for users table
  do $$
  begin
    execute 'alter publication supabase_realtime add table public.users';
  exception when duplicate_object then
    null;
  end $$;

-- Insert default admin user
INSERT INTO public.users (
  email,
  nom,
  prenom,
  role,
  code_client
) VALUES (
  'admin@lecompasolfactif.com',
  'Admin',
  'Système',
  'admin',
  'ADM001'
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  code_client = 'ADM001',
  updated_at = NOW();

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
