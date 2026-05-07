
-- Add parent_id to idea_comments for nested replies
ALTER TABLE public.idea_comments ADD COLUMN parent_id uuid REFERENCES public.idea_comments(id) ON DELETE CASCADE;

-- Create comment_likes table
CREATE TABLE public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comment_id uuid NOT NULL REFERENCES public.idea_comments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, comment_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment likes" ON public.comment_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own comment likes" ON public.comment_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own comment likes" ON public.comment_likes FOR DELETE TO authenticated USING (user_id = auth.uid());
