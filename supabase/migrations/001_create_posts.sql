-- 001_create_posts.sql
-- Run this in the Supabase SQL editor to create the posts table and RLS policies.

-- Enable the pgcrypto extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  subject_number int,
  author_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT posts
CREATE POLICY "Allow select for all" ON public.posts
  FOR SELECT
  USING (true);

-- Allow INSERT only for the admin user (replace the email if needed)
-- NOTE: the policy checks the authenticated user's email claim in the JWT.
CREATE POLICY "Allow insert for admin" ON public.posts
  FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'email') = 'tadiwasare@gmail.com');

-- Allow UPDATE and DELETE only for the admin user
CREATE POLICY "Allow update for admin" ON public.posts
  FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'tadiwasare@gmail.com');

CREATE POLICY "Allow delete for admin" ON public.posts
  FOR DELETE
  USING ((auth.jwt() ->> 'email') = 'tadiwasare@gmail.com');
