-- Create default admin user for development
-- This should only be used in development environment
create extension if not exists pgcrypto;

-- Create admin user in auth.users first
DO $$
BEGIN
  -- Check if admin user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@lecompasolfactif.com') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@lecompasolfactif.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Then insert into public.users table
INSERT INTO public.users (
  id,
  email,
  nom,
  prenom,
  role,
  code_client,
  created_at,
  updated_at
)
SELECT 
  auth.users.id,
  'admin@lecompasolfactif.com',
  'Admin',
  'Système',
  'admin',
  'ADM001',
  NOW(),
  NOW()
FROM auth.users 
WHERE auth.users.email = 'admin@lecompasolfactif.com'
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  code_client = 'ADM001',
  updated_at = NOW();
