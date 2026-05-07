
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  related_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Index for fast lookups
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, is_read) WHERE is_read = false;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger function: notify on idea_likes
CREATE OR REPLACE FUNCTION public.notify_on_idea_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _idea_owner uuid;
  _liker_name text;
BEGIN
  SELECT user_id INTO _idea_owner FROM public.ideas WHERE id = NEW.idea_id;
  IF _idea_owner IS NULL OR _idea_owner = NEW.user_id THEN RETURN NEW; END IF;
  SELECT COALESCE(display_name, username, 'Alguien') INTO _liker_name FROM public.profiles WHERE id = NEW.user_id;
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (_idea_owner, 'like', '❤️ Nuevo like', _liker_name || ' le ha gustado tu idea.', NEW.idea_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_idea_like AFTER INSERT ON public.idea_likes
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_idea_like();

-- Trigger function: notify on idea_comments
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _idea_owner uuid;
  _parent_author uuid;
  _commenter_name text;
BEGIN
  SELECT COALESCE(display_name, username, 'Alguien') INTO _commenter_name FROM public.profiles WHERE id = NEW.user_id;
  
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO _parent_author FROM public.idea_comments WHERE id = NEW.parent_id;
    IF _parent_author IS NOT NULL AND _parent_author != NEW.user_id THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (_parent_author, 'reply', '🔔 Nueva respuesta', _commenter_name || ' ha respondido a tu comentario.', NEW.idea_id);
    END IF;
  END IF;
  
  SELECT user_id INTO _idea_owner FROM public.ideas WHERE id = NEW.idea_id;
  IF _idea_owner IS NOT NULL AND _idea_owner != NEW.user_id AND _idea_owner != COALESCE(_parent_author, '00000000-0000-0000-0000-000000000000') THEN
    INSERT INTO public.notifications (user_id, type, title, message, related_id)
    VALUES (_idea_owner, 'comment', '💬 Nuevo comentario', _commenter_name || ' ha comentado tu idea.', NEW.idea_id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_comment AFTER INSERT ON public.idea_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- Trigger function: notify on follow
CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _follower_name text;
BEGIN
  IF NEW.following_id = NEW.follower_id THEN RETURN NEW; END IF;
  SELECT COALESCE(display_name, username, 'Alguien') INTO _follower_name FROM public.profiles WHERE id = NEW.follower_id;
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (NEW.following_id, 'follow', '👤 Nuevo seguidor', _follower_name || ' ha empezado a seguirte.', NEW.follower_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_follow AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();
