
-- Add is_shared flag to ideas
ALTER TABLE public.ideas ADD COLUMN is_shared BOOLEAN NOT NULL DEFAULT false;

-- Likes table
CREATE TABLE public.idea_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see likes
CREATE POLICY "Anyone can view likes"
  ON public.idea_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON public.idea_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own likes"
  ON public.idea_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Allow anyone to view shared ideas
CREATE POLICY "Anyone can view shared ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (is_shared = true OR user_id = auth.uid());

-- Drop old select policy that only showed own ideas
DROP POLICY IF EXISTS "Users can view own ideas" ON public.ideas;

-- Allow updating own ideas (for sharing)
CREATE POLICY "Users can update own ideas"
  ON public.ideas FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow public (anon) to see shared ideas for non-logged-in feed browsing
CREATE POLICY "Anon can view shared ideas"
  ON public.ideas FOR SELECT
  TO anon
  USING (is_shared = true);

-- Allow public profiles view for feed author names
CREATE POLICY "Anon can view profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);
