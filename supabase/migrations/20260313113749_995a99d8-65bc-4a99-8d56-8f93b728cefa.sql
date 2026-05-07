
-- Add is_training flag to ideas table
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_training BOOLEAN NOT NULL DEFAULT false;
