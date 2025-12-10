-- Migration: Create supervisors and assignments tables

-- Create supervisors table
CREATE TABLE IF NOT EXISTS public.supervisors (
  id text PRIMARY KEY,
  name text NOT NULL
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id text PRIMARY KEY,
  supervisor_name text,
  packer_picker_name text
);

-- Grant access to anon role (for REST)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.supervisors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.assignments TO anon;

-- Optionally create indexes for queries
CREATE INDEX IF NOT EXISTS idx_assignments_supervisor ON public.assignments (supervisor_name);
CREATE INDEX IF NOT EXISTS idx_assignments_packer_picker ON public.assignments (packer_picker_name);
