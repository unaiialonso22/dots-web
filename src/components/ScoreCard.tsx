import { motion } from "framer-motion";
import type { IdeaResult } from "@/lib/dots-data";

function scoreColor(score: number) {
  if (score >= 8) return "text-score-high";
  if (score >= 5) return "text-score-mid";
  return "text-score-low";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-heading font-medium">{label}</span>
        <span className={`font-heading font-bold ${scoreColor(score)}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ result }: { result: IdeaResult }) {
  const avg = ((result.originality + result.insight + result.campaignPotential) / 3).toFixed(1);

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-heading font-medium">Puntuaciones</p>
        <span className={`text-2xl font-heading font-bold ${scoreColor(Number(avg))}`}>{avg}</span>
      </div>
      <ScoreBar label="Originalidad" score={result.originality} />
      <ScoreBar label="Conexión conceptual" score={result.insight} />
      <ScoreBar label="Potencial creativo" score={result.campaignPotential} />
    </div>
  );
}
