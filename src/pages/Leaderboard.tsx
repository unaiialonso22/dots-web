import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import { Trophy, TrendingUp, ArrowUp } from "lucide-react";

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  total_ideas: number;
  total_votes: number;
}

interface TopIdea {
  id: string;
  dot_a: string;
  dot_b: string;
  idea_text: string;
  votes: number;
  user_id: string;
  display_name: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [topIdeas, setTopIdeas] = useState<TopIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);

    const { data: ideas } = await supabase
      .from("ideas")
      .select("user_id, id, dot_a, dot_b, idea_text, created_at, is_shared")
      .eq("is_shared", true);

    if (!ideas || ideas.length === 0) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set(ideas.map((i) => i.user_id))];
    const [profilesRes, likesRes] = await Promise.all([
      supabase.from("profiles").select("id, display_name").in("id", userIds),
      supabase.from("idea_likes").select("idea_id").in("idea_id", ideas.map((i) => i.id)),
    ]);

    const profileMap: Record<string, string> = {};
    profilesRes.data?.forEach((p) => { profileMap[p.id] = p.display_name || "Anónimo"; });

    const likeCounts: Record<string, number> = {};
    likesRes.data?.forEach((l: any) => { likeCounts[l.idea_id] = (likeCounts[l.idea_id] || 0) + 1; });

    // User ranking by total shared ideas + total votes received
    const userStats: Record<string, { totalIdeas: number; totalVotes: number }> = {};
    ideas.forEach((idea) => {
      if (!userStats[idea.user_id]) userStats[idea.user_id] = { totalIdeas: 0, totalVotes: 0 };
      userStats[idea.user_id].totalIdeas += 1;
      userStats[idea.user_id].totalVotes += likeCounts[idea.id] || 0;
    });

    const leaderboard: LeaderboardUser[] = Object.entries(userStats)
      .map(([userId, stats]) => ({
        user_id: userId,
        display_name: profileMap[userId] || "Anónimo",
        total_ideas: stats.totalIdeas,
        total_votes: stats.totalVotes,
      }))
      .sort((a, b) => b.total_votes - a.total_votes || b.total_ideas - a.total_ideas)
      .slice(0, 50);

    setUsers(leaderboard);

    // Top ideas by votes in last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentIdeas = ideas
      .filter((i) => i.created_at > oneDayAgo)
      .map((i) => ({
        id: i.id,
        dot_a: i.dot_a,
        dot_b: i.dot_b,
        idea_text: i.idea_text,
        votes: likeCounts[i.id] || 0,
        user_id: i.user_id,
        display_name: profileMap[i.user_id] || "Anónimo",
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 5);

    setTopIdeas(recentIdeas);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold mb-1">Clasificación</h1>
          <p className="text-sm text-muted-foreground">Las mentes más creativas de la comunidad</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-heading">Cargando...</p>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-heading font-bold">Ranking</h2>
              </div>

              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aún no hay ideas compartidas</p>
              ) : (
                <div className="space-y-2">
                  {users.map((u, i) => (
                    <motion.div
                      key={u.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <span className={`w-8 text-center font-heading font-bold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-heading font-semibold truncate">{u.display_name}</p>
                        <LevelBadge totalIdeas={u.total_ideas} />
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="text-sm font-heading font-bold">{u.total_ideas}</p>
                          <p className="text-[10px] text-muted-foreground">ideas</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-3.5 h-3.5 text-primary" />
                          <p className="text-sm font-heading font-bold text-primary">{u.total_votes}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-heading font-bold">Ideas destacadas de hoy</h2>
              </div>

              {topIdeas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No hay ideas en las últimas 24 horas</p>
              ) : (
                <div className="space-y-3">
                  {topIdeas.map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-border bg-card p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 bg-muted/60 rounded-full px-3 py-1">
                          <span className="text-xs font-heading font-semibold text-dot-a">{idea.dot_a}</span>
                          <span className="text-xs text-muted-foreground">×</span>
                          <span className="text-xs font-heading font-semibold text-dot-b">{idea.dot_b}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-4 h-4 text-primary" />
                          <span className="text-sm font-heading font-bold text-primary">{idea.votes}</span>
                        </div>
                      </div>
                      <p className="text-sm font-body line-clamp-2">{idea.idea_text}</p>
                      <p className="text-xs text-muted-foreground">por {idea.display_name}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
