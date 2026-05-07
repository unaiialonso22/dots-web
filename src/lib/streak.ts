import { supabase } from "@/integrations/supabase/client";

export interface StreakReward {
  type: "mini_hints" | "premium_offer" | "premium_trial";
  amount?: number;
  milestone: number;
}

const MILESTONES: { days: number; reward: StreakReward }[] = [
  { days: 7, reward: { type: "mini_hints", amount: 2, milestone: 7 } },
  { days: 14, reward: { type: "mini_hints", amount: 5, milestone: 14 } },
  { days: 21, reward: { type: "premium_offer", milestone: 21 } },
  { days: 30, reward: { type: "premium_trial", milestone: 30 } },
];

export function getStreakMessage(streak: number): string | null {
  if (streak >= 30) return "30 días creando ideas. Nivel creativo desbloqueado.";
  if (streak >= 14) return "Dos semanas de creatividad.";
  if (streak >= 7) return "Una semana conectando puntos.";
  if (streak >= 3) return `${streak} días creando ideas. ¡Sigue así!`;
  if (streak === 1) return "¡Has empezado tu racha creativa!";
  return null;
}

export async function updateStreak(userId: string): Promise<{
  current_streak: number;
  longest_streak: number;
  reward?: StreakReward;
} | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_idea_date, last_reward_streak, mini_hints_available, premium_trial_active_until" as any)
    .eq("id", userId)
    .single();

  if (!profile) return null;

  const p = profile as any;
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = p.last_idea_date;

  // Already submitted today
  if (lastDate === today) {
    return { current_streak: p.current_streak, longest_streak: p.longest_streak };
  }

  let newStreak: number;

  if (lastDate) {
    const last = new Date(lastDate);
    const todayDate = new Date(today);
    const diffMs = todayDate.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    newStreak = diffDays === 1 ? p.current_streak + 1 : 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, p.longest_streak);

  // Check for milestone rewards (only once per cycle)
  const lastRewardStreak = p.last_reward_streak || 0;
  let reward: StreakReward | undefined;

  // If streak reset (newStreak < lastRewardStreak), the cycle restarts
  const effectiveLastReward = newStreak < lastRewardStreak ? 0 : lastRewardStreak;

  for (const m of MILESTONES) {
    if (newStreak >= m.days && effectiveLastReward < m.days) {
      reward = m.reward;
      break; // Grant one reward at a time (highest unclaimed)
    }
  }

  const updateData: any = {
    current_streak: newStreak,
    longest_streak: newLongest,
    last_idea_date: today,
  };

  if (reward) {
    updateData.last_reward_streak = reward.milestone;

    if (reward.type === "mini_hints") {
      updateData.mini_hints_available = (p.mini_hints_available || 0) + (reward.amount || 0);
    } else if (reward.type === "premium_trial") {
      // 24h premium trial
      updateData.premium_trial_active_until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (reward.type === "premium_offer") {
      updateData.premium_offer_unlocked_at = new Date().toISOString();
    }
  }

  // Reset last_reward_streak if streak broke
  if (newStreak === 1 && lastRewardStreak > 0) {
    updateData.last_reward_streak = 0;
  }

  await supabase.from("profiles").update(updateData).eq("id", userId);

  // Create in-app notification for reward
  if (reward) {
    const notifMessages: Record<StreakReward["type"], { title: string; message: string }> = {
      mini_hints: {
        title: "🎉 Recompensa desbloqueada",
        message: `🔥 ${reward.milestone} días seguidos. Has desbloqueado ${reward.amount} mini-pistas.`,
      },
      premium_offer: {
        title: "⏳ Oferta Premium exclusiva",
        message: "Oferta exclusiva desbloqueada. Premium por 4,99 € disponible solo durante 24 horas.",
      },
      premium_trial: {
        title: "💎 Premium activado",
        message: "Disfruta de todas las funciones Premium durante las próximas 24 horas.",
      },
    };
    const n = notifMessages[reward.type];
    await supabase.from("notifications" as any).insert({
      user_id: userId,
      type: reward.type === "mini_hints" ? "reward" : "premium",
      title: n.title,
      message: n.message,
    });
  }

  // Create streak milestone notification (non-reward)
  if (!reward && [3, 5, 10, 20].includes(newStreak)) {
    await supabase.from("notifications" as any).insert({
      user_id: userId,
      type: "streak",
      title: "🔥 Racha creativa",
      message: `¡${newStreak} días seguidos creando ideas! Sigue así.`,
    });
  }

  return { current_streak: newStreak, longest_streak: newLongest, reward };
}

export async function useMinHint(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("mini_hints_available" as any)
    .eq("id", userId)
    .single();

  const available = (data as any)?.mini_hints_available || 0;
  if (available <= 0) return false;

  await supabase
    .from("profiles")
    .update({ mini_hints_available: available - 1 } as any)
    .eq("id", userId);

  return true;
}

export async function checkPremiumTrial(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("premium_trial_active_until" as any)
    .eq("id", userId)
    .single();

  const until = (data as any)?.premium_trial_active_until;
  if (!until) return false;
  return new Date(until) > new Date();
}

export async function checkPremiumOffer(userId: string): Promise<{ active: boolean; expiresAt?: string }> {
  const { data } = await supabase
    .from("profiles")
    .select("premium_offer_unlocked_at" as any)
    .eq("id", userId)
    .single();

  const unlockedAt = (data as any)?.premium_offer_unlocked_at;
  if (!unlockedAt) return { active: false };

  const expiresAt = new Date(new Date(unlockedAt).getTime() + 24 * 60 * 60 * 1000);
  if (expiresAt <= new Date()) return { active: false };

  return { active: true, expiresAt: expiresAt.toISOString() };
}
