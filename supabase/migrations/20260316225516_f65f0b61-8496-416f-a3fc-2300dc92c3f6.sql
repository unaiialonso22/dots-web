
ALTER TABLE public.profiles
ADD COLUMN current_streak smallint NOT NULL DEFAULT 0,
ADD COLUMN longest_streak smallint NOT NULL DEFAULT 0,
ADD COLUMN last_idea_date date;
