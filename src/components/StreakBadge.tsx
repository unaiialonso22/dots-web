import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  size?: "sm" | "md" | "lg";
  showMotivation?: boolean;
}

const REWARD_MILESTONES = [7, 14, 21, 30];

function getNextMilestone(streak: number): number | null {
  for (const m of REWARD_MILESTONES) {
    if (streak < m) return m;
  }
  return null;
}

export default function StreakBadge({ currentStreak, longestStreak, size = "sm", showMotivation = false }: StreakBadgeProps) {
  const { t } = useLanguage();
  const isActive = currentStreak > 0;
  const nextMilestone = getNextMilestone(currentStreak);
  const daysLeft = nextMilestone ? nextMilestone - currentStreak : null;

  const streakLabel = isActive
    ? `🔥 ${currentStreak} ${currentStreak === 1 ? t("streak_day") : t("streak_days")}`
    : t("streak_no_active");

  const motivationText = (() => {
    if (!isActive || !showMotivation) return null;
    if (daysLeft !== null && daysLeft <= 3 && daysLeft > 0) {
      return daysLeft === 1
        ? t("streak_close_reward", { days: 1 })
        : t("streak_close_reward_plural", { days: daysLeft });
    }
    return t("streak_keep_rewards");
  })();

  if (size === "lg") {
    return (
      <motion.div
        className="rounded-2xl border-2 border-border bg-card p-5 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-block"
        >
          <Flame className={`w-10 h-10 mx-auto mb-2 ${isActive ? "text-orange-500" : "text-muted-foreground/30"}`} />
        </motion.div>
        <p className="text-3xl font-heading font-bold">{currentStreak}</p>
        <p className="text-sm font-heading text-muted-foreground">
          {currentStreak === 1 ? t("streak_day") : t("streak_days")}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-muted-foreground">
          <Trophy className="w-3.5 h-3.5" />
          <span className="text-xs font-heading">{t("streak_best")}: {longestStreak}</span>
        </div>
        {motivationText && (
          <p className="text-xs text-muted-foreground mt-3 italic">{motivationText}</p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={isActive ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Flame className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-muted-foreground/30"}`} />
          </motion.div>
          <span className="text-sm font-heading font-semibold">{streakLabel}</span>
        </div>
        {longestStreak > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs font-heading">{t("streak_best")}: {longestStreak}</span>
          </div>
        )}
      </div>
      {motivationText && (
        <p className="text-xs text-muted-foreground italic ml-6">{motivationText}</p>
      )}
    </div>
  );
}
