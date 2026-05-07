
-- Add new columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auth_provider text NOT NULL DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS daily_change_count smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_challenge_date date NOT NULL DEFAULT CURRENT_DATE;

-- Update the handle_new_user function to capture auth provider
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _provider text;
BEGIN
  _provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');
  
  INSERT INTO public.profiles (id, display_name, auth_provider, daily_change_count, last_challenge_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    _provider,
    0,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
