import { CREATIVE_LEVELS, getCreativeLevel, getLevelMotivation } from "@/lib/levels";
import { useLanguage } from "@/hooks/useLanguage";
import { Check, Lock } from "lucide-react";

interface LevelsRoadmapProps {
  totalIdeas: number;
}

export default function LevelsRoadmap({ totalIdeas }: LevelsRoadmapProps) {
  const currentLevel = getCreativeLevel(totalIdeas);
  const { lang } = useLanguage();
  const motivation = getLevelMotivation(totalIdeas, lang);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-heading font-bold text-muted-foreground uppercase tracking-wider">
        {lang === "es" ? "Niveles creativos" : "Creative Levels"}
      </h3>

      {motivation && (
        <p className="text-xs text-muted-foreground italic bg-muted/50 rounded-xl px-4 py-2">{motivation}</p>
      )}

      <div className="space-y-2">
        {CREATIVE_LEVELS.map((level) => {
          const isUnlocked = totalIdeas >= level.minIdeas;
          const isCurrent = currentLevel.level === level.level;
          const title = lang === "en" ? level.titleEn : level.title;

          return (
            <div
              key={level.level}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                isCurrent
                  ? "border-primary bg-primary/5"
                  : isUnlocked
                  ? "border-border bg-card"
                  : "border-border/50 bg-muted/30 opacity-60"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm shrink-0 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isUnlocked
                    ? "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {isUnlocked ? <Check className="w-4 h-4" /> : level.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-heading font-semibold ${isCurrent ? "text-primary" : ""}`}>
                  {level.emoji} {title}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {level.minIdeas === 0
                    ? lang === "es" ? "Nivel inicial" : "Starting level"
                    : lang === "es"
                    ? `${level.minIdeas} ideas públicas necesarias`
                    : `${level.minIdeas} public ideas required`}
                </p>
              </div>
              {!isUnlocked && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
              {isCurrent && (
                <span className="text-[10px] font-heading font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  {lang === "es" ? "Actual" : "Current"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
