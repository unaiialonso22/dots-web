
-- Add mini-hints and streak reward tracking to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS mini_hints_available smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reward_streak smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS premium_offer_unlocked_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS premium_trial_active_until timestamp with time zone;
