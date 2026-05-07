// Creative level system — based on PUBLIC ideas only
export interface CreativeLevel {
  level: number;
  title: string;
  titleEn: string;
  emoji: string;
  minIdeas: number;
}

export const CREATIVE_LEVELS: CreativeLevel[] = [
  { level: 1, title: "Principiante", titleEn: "Beginner", emoji: "🌱", minIdeas: 0 },
  { level: 2, title: "Explorador", titleEn: "Explorer", emoji: "🔍", minIdeas: 5 },
  { level: 3, title: "Creativo", titleEn: "Creative", emoji: "💡", minIdeas: 15 },
  { level: 4, title: "Estratega", titleEn: "Strategist", emoji: "🎯", minIdeas: 30 },
  { level: 5, title: "Visionario", titleEn: "Visionary", emoji: "🚀", minIdeas: 60 },
  { level: 6, title: "Maestro creativo", titleEn: "Creative Master", emoji: "👑", minIdeas: 100 },
];

export function getCreativeLevel(totalPublicIdeas: number): CreativeLevel {
  let current = CREATIVE_LEVELS[0];
  for (const level of CREATIVE_LEVELS) {
    if (totalPublicIdeas >= level.minIdeas) current = level;
    else break;
  }
  return current;
}

export function getNextLevel(totalPublicIdeas: number): CreativeLevel | null {
  const current = getCreativeLevel(totalPublicIdeas);
  const next = CREATIVE_LEVELS.find((l) => l.level === current.level + 1);
  return next || null;
}

export function getLevelProgress(totalPublicIdeas: number): number {
  const current = getCreativeLevel(totalPublicIdeas);
  const next = getNextLevel(totalPublicIdeas);
  if (!next) return 100;
  const range = next.minIdeas - current.minIdeas;
  const progress = totalPublicIdeas - current.minIdeas;
  return Math.min(100, Math.round((progress / range) * 100));
}

/** Motivational message based on progress */
export function getLevelMotivation(totalPublicIdeas: number, lang: "es" | "en" = "es"): string | null {
  const next = getNextLevel(totalPublicIdeas);
  if (!next) {
    return lang === "es" ? "¡Has alcanzado el nivel máximo! 🏆" : "You've reached the top level! 🏆";
  }
  const remaining = next.minIdeas - totalPublicIdeas;
  if (lang === "es") {
    if (remaining <= 2) return "¡Casi llegas al siguiente nivel! 🔥";
    if (remaining <= 5) return "Tu creatividad está creciendo 🚀";
    return `Te faltan ${remaining} ideas para subir a ${next.title}`;
  } else {
    if (remaining <= 2) return "Almost at the next level! 🔥";
    if (remaining <= 5) return "Your creativity is growing 🚀";
    return `${remaining} ideas to reach ${next.titleEn}`;
  }
}
