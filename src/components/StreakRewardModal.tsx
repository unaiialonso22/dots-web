import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Flame, Lightbulb, Crown, Gift } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { StreakReward } from "@/lib/streak";

interface StreakRewardModalProps {
  open: boolean;
  onClose: () => void;
  reward: StreakReward;
  onNavigatePremium?: () => void;
}

export default function StreakRewardModal({ open, onClose, reward, onNavigatePremium }: StreakRewardModalProps) {
  const { t } = useLanguage();

  const iconMap: Record<StreakReward["type"], typeof Flame> = {
    mini_hints: Lightbulb,
    premium_offer: Crown,
    premium_trial: Gift,
  };
  const colorMap: Record<StreakReward["type"], string> = {
    mini_hints: "text-amber-500",
    premium_offer: "text-premium",
    premium_trial: "text-premium",
  };

  const Icon = iconMap[reward.type];

  const title = reward.type === "mini_hints"
    ? t("reward_mini_hints", { amount: reward.amount || 0 })
    : reward.type === "premium_offer"
    ? t("reward_premium_offer")
    : t("reward_premium_trial");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">{t("reward_unlocked")}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 gap-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-10 h-10 text-orange-500" />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-heading font-bold">
            🔥 {reward.milestone} {reward.milestone === 1 ? t("streak_day") : t("streak_days")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${colorMap[reward.type]}`} />
            <span className="font-heading font-semibold">{title}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-2 mt-2">
            {reward.type === "premium_offer" && onNavigatePremium ? (
              <>
                <Button variant="outline" onClick={onClose}>{t("reward_later")}</Button>
                <Button onClick={() => { onClose(); onNavigatePremium(); }}>
                  <Crown className="w-4 h-4 mr-1" />{t("reward_see_offer")}
                </Button>
              </>
            ) : (
              <Button onClick={onClose}>{t("reward_continue")}</Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
