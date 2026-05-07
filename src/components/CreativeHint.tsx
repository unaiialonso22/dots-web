import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/hooks/useLanguage";
import { useMinHint } from "@/lib/streak";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreativeHintProps {
  dotA: string;
  dotB: string;
}

export default function CreativeHint({ dotA, dotB }: CreativeHintProps) {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [hintsAvailable, setHintsAvailable] = useState<number | null>(null);

  const handleActivate = async () => {
    if (!user) { toast.error(t("auth_create_account_cta")); return; }
    if (hint) { setVisible(!visible); return; }
    if (isPremium) { await fetchHint(); return; }

    const { data } = await supabase.from("profiles").select("mini_hints_available" as any).eq("id", user.id).single();
    const available = (data as any)?.mini_hints_available || 0;
    setHintsAvailable(available);

    if (available > 0) {
      const used = await useMinHint(user.id);
      if (used) {
        setHintsAvailable(available - 1);
        await fetchHint();
        toast.success(t("hint_mini_used", { remaining: available - 1 }));
        return;
      }
    }
    setShowPremiumDialog(true);
  };

  const fetchHint = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("creative-hint", { body: { dotA, dotB } });
      if (error) throw error;
      if (data?.error === "premium_required") { setShowPremiumDialog(true); return; }
      if (data?.error) throw new Error(data.error);
      setHint(data.hint);
      setVisible(true);
    } catch (e: any) {
      if (e?.status === 403 || String(e).includes("403")) setShowPremiumDialog(true);
      else toast.error(t("hint_error"));
    } finally { setLoading(false); }
  };

  const buttonLabel = () => {
    if (loading) return t("hint_generating");
    if (hint) return visible ? t("hint_hide") : t("hint_show");
    if (isPremium) return t("hint_need_premium");
    if (hintsAvailable !== null && hintsAvailable > 0) return `${t("hint_use_mini")} (${hintsAvailable})`;
    return t("hint_need");
  };

  return (
    <>
      <div className="w-full space-y-3">
        <Button variant="outline" size="sm" onClick={handleActivate} disabled={loading}
          className="gap-2 border-premium/40 hover:border-premium/70 hover:bg-premium/5 transition-all">
          <Lightbulb className="w-4 h-4 text-premium" />
          {buttonLabel()}
          {hint && (visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />)}
        </Button>
        <AnimatePresence>
          {hint && visible && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-xl border border-premium/20 bg-premium/5 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-premium flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-body whitespace-pre-line leading-relaxed">{hint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-premium" />
              {t("hint_need")}
            </DialogTitle>
            <DialogDescription>{dotA} + {dotB}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-10 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-semibold text-lg mb-1">{t("hint_no_available")}</p>
              <p className="text-sm text-muted-foreground max-w-sm mb-2">{t("hint_earn_info")}</p>
              <p className="text-xs text-muted-foreground mb-4">{t("hint_earn_details")}</p>
              <Button onClick={() => { setShowPremiumDialog(false); navigate("/premium"); }}>
                {t("training_go_premium")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
