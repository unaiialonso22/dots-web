
-- Add bio to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text DEFAULT NULL;

-- Add improved idea columns to ideas
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_improved boolean DEFAULT false;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS original_idea text DEFAULT NULL;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS improved_idea text DEFAULT NULL;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for avatars
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth users upload avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
