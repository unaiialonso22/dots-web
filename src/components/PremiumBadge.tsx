import { Crown } from "lucide-react";

export default function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-premium/15 text-premium rounded-full px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider ${className}`}>
      <Crown className="w-3 h-3" />
      Premium
    </span>
  );
}
