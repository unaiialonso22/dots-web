
-- Add is_public column to ideas (default false = private)
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Create folders table
CREATE TABLE public.folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add folder_id to ideas
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS folder_id uuid REFERENCES public.folders(id) ON DELETE SET NULL DEFAULT NULL;

-- Enable RLS on folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Folders RLS: users manage their own
CREATE POLICY "Users can view own folders" ON public.folders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own folders" ON public.folders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own folders" ON public.folders FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own folders" ON public.folders FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Make portfolio_selections viewable by anyone (public portfolio)
CREATE POLICY "Anyone can view portfolio selections" ON public.portfolio_selections FOR SELECT USING (true);

-- Allow anon to view portfolio selections too
CREATE POLICY "Anon can view portfolio selections" ON public.portfolio_selections FOR SELECT TO anon USING (true);
