import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Crown, Eye, Pen, Lightbulb, Megaphone, Quote, Save, Star } from "lucide-react";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";
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

export default function Improve() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [marca, setMarca] = useState("");
  const [concepto, setConcepto] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const [addedToPortfolio, setAddedToPortfolio] = useState(false);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [result, setResult] = useState<ExpertResult | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("portfolio_selections").select("id", { count: "exact", head: true }).eq("user_id", user.id)
        .then(({ count }) => setPortfolioCount(count || 0));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) { toast.error("Inicia sesión para usar esta función."); navigate("/auth"); return; }
    if (!isPremium) { toast.error("Disponible solo en Premium."); return; }
    if (!marca.trim() || !concepto.trim() || !idea.trim()) { toast.error("Rellena todos los campos."); return; }
    setLoading(true); setResult(null); setSaved(false); setSavedIdeaId(null); setAddedToPortfolio(false);
    try {
      const { data, error } = await supabase.functions.invoke("expert-analysis", {
        body: { dotA: marca.trim(), dotB: concepto.trim(), idea: idea.trim() },
      });
      if (error) throw error;
      if (data?.error === "premium_required") { toast.error("Disponible solo en Premium."); return; }
      if (data?.error) throw new Error(data.error);
      setResult(data as ExpertResult);
    } catch (e: any) {
      console.error("Expert analysis error:", e);
      toast.error(e.message || "Error al generar el análisis.");
    } finally { setLoading(false); }
  };

  const handleSaveImproved = async () => {
    if (!user || !result) return;
    setSaving(true);
    try {
      const { data: insertedIdea } = await supabase.from("ideas").insert({
        user_id: user.id, dot_a: marca.trim(), dot_b: concepto.trim(),
        idea_text: result.improved_idea, originality: 0, insight: 0, campaign_potential: 0,
        is_training: false, is_improved: true, original_idea: idea.trim(),
        improved_idea: result.improved_idea, is_public: false,
      } as any).select("id").single();
      if (insertedIdea) setSavedIdeaId(insertedIdea.id);
      setSaved(true);
      toast.success("¡Idea mejorada guardada como privada!");
    } catch (e) {
      console.error("Save error:", e);
      toast.error("Error al guardar la idea.");
    } finally { setSaving(false); }
  };

  const handleAddToPortfolio = async () => {
    if (!user || !savedIdeaId) return;
    if (portfolioCount >= 10) { toast.error("Máximo 10 ideas en tu portfolio."); return; }
    try {
      await supabase.from("ideas").update({ is_public: true } as any).eq("id", savedIdeaId);
      await supabase.from("portfolio_selections").insert({ user_id: user.id, idea_id: savedIdeaId, position: portfolioCount });
      setAddedToPortfolio(true);
      setPortfolioCount((prev) => prev + 1);
      toast.success("¡Idea añadida a tu portfolio público!");
    } catch (e) { toast.error("Error al añadir al portfolio."); }
  };

  const sections = result ? [
    { icon: Eye, title: "Análisis creativo", content: result.creative_analysis },
    { icon: Pen, title: "Mejora de la idea", content: result.improved_idea },
    { icon: Lightbulb, title: "Insight creativo", content: result.creative_insight },
    { icon: Sparkles, title: "Concepto creativo", content: result.creative_concept },
    { icon: Megaphone, title: "Ejecución publicitaria", content: result.execution },
    { icon: Quote, title: "Copy publicitario", content: `Tagline: "${result.tagline}"\n\n${result.campaign_message}` },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNav />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-primary">Perfecciona tu idea</span>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Mejora tu idea con IA</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Introduce tu marca, concepto e idea. Nuestro experto creativo IA la analizará y perfeccionará.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-border bg-card p-6 space-y-5 mb-8">
          <div>
            <label className="block text-sm font-heading font-medium mb-2">Marca</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ej: Nike, Apple, Coca-Cola..."
              className="w-full rounded-xl border-2 border-border bg-background p-3 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-heading font-medium mb-2">Concepto</label>
            <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej: Sostenibilidad, Nostalgia, Aventura..."
              className="w-full rounded-xl border-2 border-border bg-background p-3 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-heading font-medium mb-2">Tu idea</label>
            <textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe tu idea creativa..."
              className="w-full min-h-[140px] rounded-xl border-2 border-border bg-background p-4 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 resize-none transition-colors" />
          </div>
          {!isPremium ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" /><span className="text-sm font-heading">Disponible solo en Premium.</span>
              </div>
              <Button onClick={() => navigate("/premium")} variant="outline" className="gap-2">
                <Crown className="w-4 h-4" />Hazte Premium
              </Button>
            </div>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !marca.trim() || !concepto.trim() || !idea.trim()} className="w-full gap-2">
              <Sparkles className="w-4 h-4" />{loading ? "Analizando..." : "Mejorar con IA"}
            </Button>
          )}
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-sm text-muted-foreground font-heading">Analizando tu idea...</p>
          </div>
        )}

        {result && !loading && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Before vs After comparison */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-primary/20 bg-card p-6 space-y-4"
              >
                <h3 className="text-base font-heading font-bold text-center">Antes vs Después</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">Idea original</p>
                    <p className="text-sm font-body text-foreground/80 leading-relaxed">{idea}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary mb-2">Idea mejorada</p>
                    <p className="text-sm font-body text-foreground leading-relaxed">{result.improved_idea}</p>
                  </div>
                </div>
              </motion.div>

              {sections.map((section, i) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <section.icon className="w-4 h-4 text-primary" />
                    <p className="text-sm font-heading font-semibold">{section.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground font-body whitespace-pre-line">{section.content}</p>
                </motion.div>
              ))}

              {/* Save options */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-2xl border-2 border-border bg-card p-5 space-y-3">
                {!saved ? (
                  <Button onClick={handleSaveImproved} disabled={saving} className="w-full gap-2">
                    <Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar idea mejorada"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button disabled variant="outline" className="w-full gap-2 text-score-high">
                      <Lock className="w-4 h-4" />✓ Guardada como privada
                    </Button>
                    {!addedToPortfolio ? (
                      <Button variant="outline" className="w-full gap-2" onClick={handleAddToPortfolio}>
                        <Star className="w-4 h-4" />Añadir al portfolio ({portfolioCount}/10)
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full gap-2 text-score-high" disabled>
                        <Star className="w-4 h-4" />✓ En tu portfolio
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
    </div>
  );
}
