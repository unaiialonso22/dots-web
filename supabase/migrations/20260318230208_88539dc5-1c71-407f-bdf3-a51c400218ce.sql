
-- Create comments table
CREATE TABLE public.idea_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments on shared ideas
CREATE POLICY "Anyone can view comments" ON public.idea_comments FOR SELECT USING (true);
CREATE POLICY "Anon can view comments" ON public.idea_comments FOR SELECT TO anon USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Users can insert comments" ON public.idea_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON public.idea_comments FOR DELETE TO authenticated USING (user_id = auth.uid());
