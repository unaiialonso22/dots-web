
-- Add attached_file_url column to ideas
ALTER TABLE public.ideas ADD COLUMN attached_file_url text DEFAULT NULL;

-- Create storage bucket for idea attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('idea-attachments', 'idea-attachments', true);

-- RLS: anyone can view files in idea-attachments
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'idea-attachments');

-- RLS: authenticated users can upload to idea-attachments
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'idea-attachments');

-- RLS: users can delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'idea-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
