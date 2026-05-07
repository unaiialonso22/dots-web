import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Heart, MessageCircle, Reply, UserPlus, Flame, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const typeIcons: Record<string, typeof Heart> = {
  like: Heart, comment: MessageCircle, reply: Reply, follow: UserPlus,
  streak: Flame, reward: Gift, premium: Sparkles, motivation: Sparkles,
};
const typeColors: Record<string, string> = {
  like: "text-red-500", comment: "text-blue-500", reply: "text-blue-400",
  follow: "text-primary", streak: "text-orange-500", reward: "text-amber-500",
  premium: "text-premium", motivation: "text-primary",
};

function NotificationItem({ notif, onRead, onClick, lang }: {
  notif: AppNotification; onRead: () => void; onClick: () => void; lang: string;
}) {
  const Icon = typeIcons[notif.type] || Bell;
  const color = typeColors[notif.type] || "text-muted-foreground";
  return (
    <button onClick={() => { if (!notif.is_read) onRead(); onClick(); }}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${!notif.is_read ? "bg-primary/5" : ""}`}>
      <div className={`mt-0.5 ${color}`}><Icon className="w-4 h-4" /></div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body leading-snug ${!notif.is_read ? "font-medium" : "text-muted-foreground"}`}>{notif.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: lang === "es" ? es : undefined })}
        </p>
      </div>
      {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
    </button>
  );
}

export default function NotificationCenter() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleClick = (notif: AppNotification) => {
    setOpen(false);
    if (notif.related_id) {
      if (notif.type === "follow") navigate(`/user/${notif.related_id}`);
      else navigate("/feed");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="relative" aria-label={t("nav_notifications")}>
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-heading font-semibold">{t("notif_title")}</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Check className="w-3 h-3" />{t("notif_mark_all")}
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p>{t("notif_empty")}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem key={notif.id} notif={notif} lang={lang} onRead={() => markAsRead(notif.id)} onClick={() => handleClick(notif)} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
