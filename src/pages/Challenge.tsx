import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  getRandomDots,
  getDailyChallenge,
  getDailyShufflesLeft,
  recordShuffle,
  setDailyChallenge,
  type IdeaResult,
} from "@/lib/dots-data";
import { Shuffle, Share2, Paperclip, X, Lock, Star, FolderPlus, ImagePlus } from "lucide-react";
import ScoreCard from "@/components/ScoreCard";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import StreakBadge from "@/components/StreakBadge";
import ExpertAnalysis from "@/components/ExpertAnalysis";
import CreativeHint from "@/components/CreativeHint";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { updateStreak, getStreakMessage, type StreakReward } from "@/lib/streak";
import StreakRewardModal from "@/components/StreakRewardModal";

type Phase = "dots" | "write" | "result";

const Challenge = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dots, setDots] = useState(() => getDailyChallenge());
  const [shufflesLeft, setShufflesLeft] = useState(getDailyShufflesLeft);
  const [phase, setPhase] = useState<Phase>("dots");
  const [idea, setIdea] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<IdeaResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [addedToPortfolio, setAddedToPortfolio] = useState(false);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [pendingReward, setPendingReward] = useState<StreakReward | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_public", true)
        .then(({ count }) => setTotalIdeas(count || 0));
      supabase.from("profiles").select("current_streak, longest_streak").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) setStreak({ current: data.current_streak, longest: data.longest_streak });
        });
      supabase.from("portfolio_selections").select("id", { count: "exact", head: true }).eq("user_id", user.id)
        .then(({ count }) => setPortfolioCount(count || 0));
    }
  }, [user]);

  const reshuffle = () => {
    if (shufflesLeft <= 0) {
      toast.error("Has usado los 3 cambios de hoy. ¡Vuelve mañana!");
      return;
    }
    const newDots = getRandomDots();
    setDailyChallenge(newDots);
    setDots({ date: new Date().toISOString().slice(0, 10), ...newDots });
    setShufflesLeft(recordShuffle());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const validTypes = ["image/jpeg", "image/png", "video/mp4"];
    const maxFiles = 3 - mediaFiles.length;
    const toAdd: File[] = [];
    const previews: string[] = [];
    for (const file of files.slice(0, maxFiles)) {
      if (!validTypes.includes(file.type)) { toast.error("Solo se permiten JPG, PNG o MP4."); continue; }
      if (file.size > 100 * 1024 * 1024) { toast.error("El archivo supera el tamaño máximo de 100MB."); continue; }
      toAdd.push(file);
      if (file.type.startsWith("image/")) previews.push(URL.createObjectURL(file));
      else previews.push("video:" + URL.createObjectURL(file));
    }
    if (toAdd.length === 0) return;
    setMediaFiles((prev) => [...prev, ...toAdd]);
    setMediaPreviews((prev) => [...prev, ...previews]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadFiles = async () => {
    if (!mediaFiles.length || !user || !savedIdeaId) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of mediaFiles) {
        const ext = file.name.split(".").pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("idea-attachments").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("idea-attachments").getPublicUrl(filePath);
        urls.push(urlData.publicUrl);
      }
      await supabase.from("ideas").update({ media_urls: urls } as any).eq("id", savedIdeaId);
      setUploadedMediaUrls(urls);
      toast.success("¡Archivos adjuntados!");
    } catch (e) {
      console.error("Upload error:", e);
      toast.error("Error al subir los archivos.");
    } finally { setUploading(false); }
  };

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
        originality: data.originality,
        insight: data.insight,
        campaignPotential: data.campaignPotential,
        explanation: data.explanation,
        suggestion: data.suggestion,
      };
      setResult(ideaResult);
      setPhase("result");

      if (user) {
        const { data: insertedIdea } = await supabase.from("ideas").insert({
          user_id: user.id,
          dot_a: dots.dotA,
          dot_a_category: dots.dotACategory || null,
          dot_b: dots.dotB,
          dot_b_category: dots.dotBCategory || null,
          idea_text: idea.trim(),
          originality: data.originality,
          insight: data.insight,
          campaign_potential: data.campaignPotential,
          explanation: data.explanation,
          suggestion: data.suggestion,
          is_training: false,
          is_public: false,
        } as any).select("id").single();
        if (insertedIdea) {
          setSavedIdeaId(insertedIdea.id);
          setTotalIdeas((prev) => prev + 1);
        }
        const streakResult = await updateStreak(user.id);
        if (streakResult) {
          setStreak({ current: streakResult.current_streak, longest: streakResult.longest_streak });
          const msg = getStreakMessage(streakResult.current_streak);
          if (msg) toast.success(`🔥 ${msg}`);
          if (streakResult.reward) setPendingReward(streakResult.reward);
        }
      }
    } catch (e: any) {
      console.error("Error de evaluación:", e);
      toast.error(e.message || "Error al evaluar la idea. Inténtalo de nuevo.");
    } finally { setEvaluating(false); }
  };

  const handleAddToPortfolio = async () => {
    if (!user || !savedIdeaId) return;
    if (portfolioCount >= 10) {
      toast.error("Máximo 10 ideas en tu portfolio. Elimina una primero.");
      return;
    }
    try {
      await supabase.from("ideas").update({ is_public: true } as any).eq("id", savedIdeaId);
      await supabase.from("portfolio_selections").insert({
        user_id: user.id,
        idea_id: savedIdeaId,
        position: portfolioCount,
      });
      setAddedToPortfolio(true);
      setPortfolioCount((prev) => prev + 1);
      toast.success("¡Idea añadida a tu portfolio público!");
    } catch (e) {
      console.error("Portfolio error:", e);
      toast.error("Error al añadir al portfolio.");
    }
  };

  const handleNewChallenge = () => {
    const newDots = getDailyChallenge();
    setDots(newDots);
    setShufflesLeft(getDailyShufflesLeft());
    setMediaFiles([]);
    setMediaPreviews([]);
    setUploadedMediaUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setResult(null);
    setSavedIdeaId(null);
    setShared(false);
    setAddedToPortfolio(false);
    setPhase("dots");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        {user && (
          <div className="flex flex-col items-center gap-3 mb-6">
            <LevelBadge totalIdeas={totalIdeas} showProgress />
            <StreakBadge currentStreak={streak.current} longestStreak={streak.longest} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === "dots" && (
            <motion.div key="dots" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground font-heading uppercase tracking-widest">Reto diario</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full rounded-2xl border-2 border-border bg-card p-6 text-center">
                  <span className="text-xs font-heading uppercase tracking-widest text-dot-a mb-1 block">Marca</span>
                  <span className="text-2xl font-heading font-bold">{dots.dotA}</span>
                  <span className="text-xs text-muted-foreground block mt-1">{dots.dotACategory}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-muted-foreground">+</span>
                </div>
                <div className="flex-1 w-full rounded-2xl border-2 border-border bg-card p-6 text-center">
                  <span className="text-xs font-heading uppercase tracking-widest text-dot-b mb-1 block">Concepto</span>
                  <span className="text-2xl font-heading font-bold">{dots.dotB}</span>
                  <span className="text-xs text-muted-foreground block mt-1">{dots.dotBCategory}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={reshuffle} disabled={shufflesLeft <= 0}>
                    <Shuffle className="w-4 h-4 mr-1" />Cambiar ({shufflesLeft}/3)
                  </Button>
                  <Button onClick={() => setPhase("write")}>Aceptar reto</Button>
                </div>
                {shufflesLeft <= 0 && <p className="text-xs text-muted-foreground">No te quedan cambios hoy</p>}
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
              <div className="flex justify-center">
                <CreativeHint dotA={dots.dotA} dotB={dots.dotB} />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium mb-2">Tu idea creativa</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="¿Cómo conectarías estos dos conceptos? Describe una campaña, producto, experiencia o historia..."
                  className="w-full min-h-[180px] rounded-xl border-2 border-border bg-card p-4 text-base font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 resize-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-2">{idea.length} caracteres</p>
              </div>
              {!user && (
                <p className="text-xs text-muted-foreground text-center">
                  <button onClick={() => navigate("/auth")} className="text-primary hover:underline">Inicia sesión</button> para guardar tus ideas
                </p>
              )}
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
                <div>
                  <p className="text-sm font-heading font-medium mb-1">Explicación</p>
                  <p className="text-sm text-muted-foreground font-body">{result.explanation}</p>
                </div>
                <div>
                  <p className="text-sm font-heading font-medium mb-1">Mejora creativa</p>
                  <p className="text-sm text-muted-foreground font-body">{result.suggestion}</p>
                </div>
              </div>

              {user && (
                <div className="flex justify-center">
                  <ExpertAnalysis dotA={dots.dotA} dotB={dots.dotB} idea={idea} />
                </div>
              )}

              {/* Media attachment */}
              {user && savedIdeaId && (
                <div className="space-y-3">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,video/mp4" multiple onChange={handleFileChange} className="hidden" />
                  {uploadedMediaUrls.length > 0 ? (
                    <div className="rounded-xl border-2 border-border bg-card p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedMediaUrls.map((url, idx) => (
                          /\.(mp4)$/i.test(url) ? (
                            <video key={idx} src={url} controls className="w-full h-20 rounded-lg object-cover" />
                          ) : (
                            <img key={idx} src={url} alt="Adjunto" className="w-full h-20 rounded-lg object-cover" />
                          )
                        ))}
                      </div>
                      <p className="text-sm font-body text-score-high mt-2 text-center">✓ Archivos adjuntados</p>
                    </div>
                  ) : mediaFiles.length > 0 ? (
                    <div className="rounded-xl border-2 border-border bg-card p-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {mediaPreviews.map((preview, idx) => (
                          <div key={idx} className="relative">
                            {preview.startsWith("video:") ? (
                              <video src={preview.replace("video:", "")} className="w-full h-20 rounded-lg object-cover" />
                            ) : (
                              <img src={preview} alt="Vista previa" className="w-full h-20 rounded-lg object-cover" />
                            )}
                            <button onClick={() => removeFile(idx)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {mediaFiles.length < 3 && (
                          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <ImagePlus className="w-3 h-3 mr-1" />Añadir más
                          </Button>
                        )}
                        <Button size="sm" onClick={handleUploadFiles} disabled={uploading} className="ml-auto">
                          {uploading ? "Subiendo..." : "Subir archivos"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full rounded-xl border-2 border-dashed border-border bg-card p-4 text-sm text-muted-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                      <ImagePlus className="w-4 h-4" />Añadir archivos (opcional) — JPG, PNG o MP4 (máx. 3, 100MB)
                    </button>
                  )}
                </div>
              )}

              {/* Save options */}
              {user && savedIdeaId && (
                <div className="rounded-2xl border-2 border-border bg-card p-5 space-y-3">
                  <p className="text-sm font-heading font-medium text-center">¿Qué quieres hacer con tu idea?</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="flex-1 gap-2" disabled>
                      <Lock className="w-4 h-4" />✓ Guardada como privada
                    </Button>
                    {!addedToPortfolio ? (
                      <Button variant="outline" className="flex-1 gap-2" onClick={handleAddToPortfolio}>
                        <Star className="w-4 h-4" />Añadir al portfolio ({portfolioCount}/10)
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 gap-2 text-score-high" disabled>
                        <Star className="w-4 h-4" />✓ En tu portfolio
                      </Button>
                    )}
                  </div>
                  {!shared ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={async () => {
                        await supabase.from("ideas").update({ is_shared: true } as any).eq("id", savedIdeaId);
                        setShared(true);
                        toast.success("¡Idea compartida en la comunidad!");
                      }}
                    >
                      <Share2 className="w-4 h-4" />Compartir en la comunidad
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full gap-2 text-score-high">
                      <Share2 className="w-4 h-4" />✓ Compartida
                    </Button>
                  )}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" onClick={() => navigate("/feed")}>Comunidad</Button>
                <Button onClick={handleNewChallenge} className="flex-1">Nuevo reto</Button>
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

export default Challenge;
