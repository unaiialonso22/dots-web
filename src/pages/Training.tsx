import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getRandomDots, type IdeaResult } from "@/lib/dots-data";
import { Shuffle, Share2, Dumbbell, Lock, Crown, Star } from "lucide-react";
import ScoreCard from "@/components/ScoreCard";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import ExpertAnalysis from "@/components/ExpertAnalysis";
import CreativeHint from "@/components/CreativeHint";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { updateStreak, getStreakMessage, type StreakReward } from "@/lib/streak";
import StreakRewardModal from "@/components/StreakRewardModal";

type Phase = "dots" | "write" | "result";

const Training = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [dots, setDots] = useState(() => getRandomDots());
  const [phase, setPhase] = useState<Phase>("dots");
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<IdeaResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [addedToPortfolio, setAddedToPortfolio] = useState(false);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [pendingReward, setPendingReward] = useState<StreakReward | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id)
        .then(({ count }) => setTotalIdeas(count || 0));
      supabase.from("portfolio_selections").select("id", { count: "exact", head: true }).eq("user_id", user.id)
        .then(({ count }) => setPortfolioCount(count || 0));
    }
  }, [user]);

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="max-w-2xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-premium/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-premium" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold mb-2">Modo Entrenamiento</h1>
              <p className="text-muted-foreground max-w-md">El modo entrenamiento es una función Premium.</p>
            </div>
            <Button onClick={() => navigate("/premium")} className="gap-2">
              <Crown className="w-4 h-4" />Hazte Premium
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const reshuffle = () => setDots(getRandomDots());

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    setEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-idea", {
        body: { dotA: dots.dotA, dotB: dots.dotB, idea: idea.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const ideaResult: IdeaResult = {
        originality: data.originality, insight: data.insight,
        campaignPotential: data.campaignPotential, explanation: data.explanation, suggestion: data.suggestion,
      };
      setResult(ideaResult);
      setPhase("result");

      if (user) {
        const { data: insertedIdea } = await supabase.from("ideas").insert({
          user_id: user.id, dot_a: dots.dotA, dot_a_category: dots.dotACategory || null,
          dot_b: dots.dotB, dot_b_category: dots.dotBCategory || null,
          idea_text: idea.trim(), originality: data.originality, insight: data.insight,
          campaign_potential: data.campaignPotential, explanation: data.explanation,
          suggestion: data.suggestion, is_training: true, is_public: false,
        } as any).select("id").single();
        if (insertedIdea) { setSavedIdeaId(insertedIdea.id); setTotalIdeas((prev) => prev + 1); }
        const streakResult = await updateStreak(user.id);
        if (streakResult) {
          const msg = getStreakMessage(streakResult.current_streak);
          if (msg) toast.success(`🔥 ${msg}`);
          if (streakResult.reward) setPendingReward(streakResult.reward);
        }
      }
    } catch (e: any) {
      console.error("Error de evaluación:", e);
      toast.error(e.message || "Error al evaluar la idea.");
    } finally { setEvaluating(false); }
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

  const handleNew = () => {
    setDots(getRandomDots()); setIdea(""); setResult(null); setSavedIdeaId(null);
    setShared(false); setAddedToPortfolio(false); setPhase("dots");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 mb-3">
            <Dumbbell className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Modo entrenamiento</span>
          </div>
          <p className="text-sm text-muted-foreground">Retos ilimitados · Practica tu creatividad</p>
        </div>
        {user && (
          <div className="flex justify-center mb-6">
            <LevelBadge totalIdeas={totalIdeas} showProgress />
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === "dots" && (
            <motion.div key="dots" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full rounded-2xl border-2 border-border bg-card p-6 text-center">
                  <span className="text-xs font-heading uppercase tracking-widest text-dot-a mb-1 block">Marca</span>
                  <span className="text-2xl font-heading font-bold">{dots.dotA}</span>
                  <span className="text-xs text-muted-foreground block mt-1">{dots.dotACategory}</span>
                </div>
                <div className="flex items-center justify-center"><span className="text-2xl font-heading font-bold text-muted-foreground">+</span></div>
                <div className="flex-1 w-full rounded-2xl border-2 border-border bg-card p-6 text-center">
                  <span className="text-xs font-heading uppercase tracking-widest text-dot-b mb-1 block">Concepto</span>
                  <span className="text-2xl font-heading font-bold">{dots.dotB}</span>
                  <span className="text-xs text-muted-foreground block mt-1">{dots.dotBCategory}</span>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" onClick={reshuffle}><Shuffle className="w-4 h-4 mr-1" />Cambiar</Button>
                <Button onClick={() => setPhase("write")}>Aceptar reto</Button>
              </div>
            </motion.div>
          )}

          {phase === "write" && (
            <motion.div key="write" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center justify-center gap-3 text-sm font-heading">
                <span className="text-dot-a font-semibold">{dots.dotA}</span>
                <span className="text-muted-foreground">+</span>
                <span className="text-dot-b font-semibold">{dots.dotB}</span>
              </div>
              <div className="flex justify-center"><CreativeHint dotA={dots.dotA} dotB={dots.dotB} /></div>
              <div>
                <label className="block text-sm font-heading font-medium mb-2">Tu idea creativa</label>
                <textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="¿Cómo conectarías estos dos conceptos?"
                  className="w-full min-h-[180px] rounded-xl border-2 border-border bg-card p-4 text-base font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 resize-none transition-colors" />
                <p className="text-xs text-muted-foreground mt-2">{idea.length} caracteres</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPhase("dots")}>Atrás</Button>
                <Button onClick={handleSubmit} disabled={idea.trim().length < 20 || evaluating} className="flex-1">
                  {evaluating ? "Evaluando..." : "Enviar idea"}
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-heading uppercase tracking-widest mb-2">Resultados</p>
                <div className="flex items-center justify-center gap-3 text-sm font-heading mb-4">
                  <span className="text-dot-a font-semibold">{dots.dotA}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-dot-b font-semibold">{dots.dotB}</span>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-2 font-heading">Tu idea</p>
                <p className="font-body">{idea}</p>
              </div>
              <ScoreCard result={result} />
              <div className="rounded-2xl border-2 border-border bg-card p-6 space-y-4">
                <div><p className="text-sm font-heading font-medium mb-1">Explicación</p><p className="text-sm text-muted-foreground font-body">{result.explanation}</p></div>
                <div><p className="text-sm font-heading font-medium mb-1">Mejora creativa</p><p className="text-sm text-muted-foreground font-body">{result.suggestion}</p></div>
              </div>
              {user && <div className="flex justify-center"><ExpertAnalysis dotA={dots.dotA} dotB={dots.dotB} idea={idea} /></div>}

              {/* Save options */}
              {user && savedIdeaId && (
                <div className="rounded-2xl border-2 border-border bg-card p-5 space-y-3">
                  <p className="text-sm font-heading font-medium text-center">¿Qué quieres hacer con tu idea?</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="flex-1 gap-2" disabled><Lock className="w-4 h-4" />✓ Guardada como privada</Button>
                    {!addedToPortfolio ? (
                      <Button variant="outline" className="flex-1 gap-2" onClick={handleAddToPortfolio}>
                        <Star className="w-4 h-4" />Añadir al portfolio ({portfolioCount}/10)
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 gap-2 text-score-high" disabled><Star className="w-4 h-4" />✓ En tu portfolio</Button>
                    )}
                  </div>
                  {!shared ? (
                    <Button variant="outline" className="w-full gap-2" onClick={async () => {
                      await supabase.from("ideas").update({ is_shared: true } as any).eq("id", savedIdeaId);
                      setShared(true); toast.success("¡Idea compartida en la comunidad!");
                    }}><Share2 className="w-4 h-4" />Compartir en la comunidad</Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full gap-2 text-score-high"><Share2 className="w-4 h-4" />✓ Compartida</Button>
                  )}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleNew} className="flex-1">Siguiente reto</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pendingReward && (
          <StreakRewardModal
            open={!!pendingReward}
            onClose={() => setPendingReward(null)}
            reward={pendingReward}
            onNavigatePremium={() => navigate("/premium")}
          />
        )}
      </main>
    </div>
  );
};

export default Training;
