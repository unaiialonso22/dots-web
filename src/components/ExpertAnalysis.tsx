import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Lock, Lightbulb, Pen, Eye, Megaphone, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface ExpertResult {
  creative_analysis: string;
  improved_idea: string;
  creative_insight: string;
  creative_concept: string;
  execution: string;
  tagline: string;
  campaign_message: string;
}

interface ExpertAnalysisProps {
  dotA: string;
  dotB: string;
  idea: string;
}

export default function ExpertAnalysis({ dotA, dotB, idea }: ExpertAnalysisProps) {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExpertResult | null>(null);

  const handleClick = async () => {
    if (!user) {
      toast.error("Inicia sesión para usar esta función.");
      return;
    }

    if (!isPremium) {
      setOpen(true);
      return;
    }

    setOpen(true);
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("expert-analysis", {
        body: { dotA, dotB, idea },
      });

      if (error) {
        const errorBody = typeof error === "object" && "message" in error ? error.message : String(error);
        if (errorBody.includes("premium_required") || errorBody.includes("403")) {
          setLoading(false);
          return;
        }
        throw error;
      }

      if (data?.error === "premium_required") {
        setLoading(false);
        return;
      }
      if (data?.error) throw new Error(data.error);

      setResult(data as ExpertResult);
    } catch (e: any) {
      console.error("Expert analysis error:", e);
      toast.error(e.message || "Error al generar el análisis experto.");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const sections = result
    ? [
        { icon: Eye, title: "Análisis creativo", content: result.creative_analysis },
        { icon: Pen, title: "Mejora de la idea", content: result.improved_idea },
        { icon: Lightbulb, title: "Insight creativo", content: result.creative_insight },
        { icon: Sparkles, title: "Concepto creativo", content: result.creative_concept },
        { icon: Megaphone, title: "Ejecución publicitaria", content: result.execution },
        { icon: Quote, title: "Copy publicitario", content: `Tagline: "${result.tagline}"\n\n${result.campaign_message}` },
      ]
    : [];

  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        className="gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        Mejorar idea con IA (Premium)
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Modo Experto Creativo IA
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {!isPremium ? "Análisis profesional de tu idea creativa" : `${dotA} + ${dotB}`}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground font-heading">Analizando tu idea...</p>
            </div>
          )}

          {!isPremium && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-heading font-semibold text-lg mb-1">Función Premium</p>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Esta función forma parte del plan Premium. Obtén análisis creativos profesionales,
                  mejoras de ideas y copy publicitario generado por IA.
                </p>
                <Button onClick={() => { setOpen(false); navigate("/premium"); }}>
                  Hazte Premium
                </Button>
              </div>
            </div>
          )}

          {result && !loading && (
            <AnimatePresence>
              <div className="space-y-4">
                {sections.map((section, i) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <section.icon className="w-4 h-4 text-primary" />
                      <p className="text-sm font-heading font-semibold">{section.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-body whitespace-pre-line">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
