
-- Create saved_ideas table for bookmarking others' ideas
CREATE TABLE public.saved_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

ALTER TABLE public.saved_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved ideas" ON public.saved_ideas
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can save ideas" ON public.saved_ideas
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave ideas" ON public.saved_ideas
  FOR DELETE TO authenticated USING (user_id = auth.uid());
