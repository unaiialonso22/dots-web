import { getCreativeLevel, getNextLevel, getLevelProgress, getLevelMotivation } from "@/lib/levels";
import { useLanguage } from "@/hooks/useLanguage";

interface LevelBadgeProps {
  totalIdeas: number;
  showProgress?: boolean;
  size?: "sm" | "md";
}

export default function LevelBadge({ totalIdeas, showProgress = false, size = "sm" }: LevelBadgeProps) {
  const { lang } = useLanguage();
  const level = getCreativeLevel(totalIdeas);
  const next = getNextLevel(totalIdeas);
  const progress = getLevelProgress(totalIdeas);
  const motivation = getLevelMotivation(totalIdeas, lang);
  const title = lang === "en" ? level.titleEn : level.title;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 ${size === "md" ? "text-sm" : "text-xs"} font-heading font-semibold`}>
          {level.emoji}
          <span className="font-medium text-muted-foreground">{title}</span>
        </span>
      </div>
      {showProgress && (
        <div className="space-y-1">
          {next && (
            <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full max-w-[200px]">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">
            🧠 {totalIdeas} {lang === "es" ? "ideas publicadas" : "published ideas"}
          </p>
          {motivation && (
            <p className="text-[10px] text-muted-foreground/80 italic">{motivation}</p>
          )}
        </div>
      )}
    </div>
  );
}
