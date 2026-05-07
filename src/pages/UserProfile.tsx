import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import StreakBadge from "@/components/StreakBadge";

interface ProfileData {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  current_streak: number;
  longest_streak: number;
}

interface IdeaRow {
  id: string;
  dot_a: string;
  dot_b: string;
  idea_text: string;
  created_at: string;
  attached_file_url: string | null;
  media_urls: string[] | null;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!userId) return;
    if (isOwnProfile) { navigate("/portfolio"); return; }
    loadProfile();
  }, [userId, user]);

  const loadProfile = async () => {
    if (!userId) return;
    setLoading(true);

    const [profileRes, ideasRes, followersRes, followingRes, myFollowRes] = await Promise.all([
      supabase.from("profiles").select("display_name, username, avatar_url, bio, current_streak, longest_streak").eq("id", userId).single(),
      supabase.from("ideas").select("id, dot_a, dot_b, idea_text, created_at, attached_file_url, media_urls").eq("user_id", userId).eq("is_public", true).order("created_at", { ascending: false }),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", userId),
      user ? supabase.from("follows").select("id").eq("follower_id", user.id).eq("following_id", userId) : Promise.resolve({ data: [] }),
    ]);

    if (profileRes.data) setProfile(profileRes.data as any);
    if (ideasRes.data) {
      setIdeas(ideasRes.data as any);
      setTotalIdeas(ideasRes.data.length);
    }
    setFollowerCount(followersRes.count || 0);
    setFollowingCount(followingRes.count || 0);
    setIsFollowing((myFollowRes.data || []).length > 0);
    setLoading(false);
  };

  const toggleFollow = async () => {
    if (!user || !userId) { toast.error(t("auth_create_account_cta")); return; }
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId);
      setIsFollowing(false);
      setFollowerCount((p) => Math.max(0, p - 1));
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: userId } as any);
      setIsFollowing(true);
      setFollowerCount((p) => p + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground font-heading">{t("profile_loading")}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground font-heading">{t("profile_not_found")}</p>
          <Button variant="outline" onClick={() => navigate("/feed")}>{t("profile_back_community")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-muted border-4 border-border overflow-hidden flex items-center justify-center mb-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-heading font-bold text-muted-foreground">{(profile.display_name || "?")[0].toUpperCase()}</span>
            )}
          </div>

          <h1 className="text-2xl font-heading font-bold">{profile.display_name || "Sin nombre"}</h1>
          {profile.username && <p className="text-sm text-muted-foreground font-heading">@{profile.username}</p>}
          {profile.bio && <p className="text-sm text-muted-foreground font-body mt-1 max-w-sm">{profile.bio}</p>}

          {user && !isOwnProfile && (
            <Button variant={isFollowing ? "outline" : "default"} size="sm" className="mt-3" onClick={toggleFollow}>
              {isFollowing ? t("feed_following") : t("feed_follow")}
            </Button>
          )}

          <div className="flex items-center gap-5 mt-6 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{ideas.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("profile_portfolio")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{followerCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("profile_followers")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{followingCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("profile_following_label")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <LevelBadge totalIdeas={totalIdeas} showProgress size="md" />
            <StreakBadge currentStreak={profile.current_streak} longestStreak={profile.longest_streak} showMotivation />
          </div>
        </motion.div>

        <div className="mb-4">
          <h2 className="text-lg font-heading font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> {t("profile_public_portfolio")}
          </h2>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-heading">{t("profile_no_public_ideas")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea, i) => (
              <motion.div key={idea.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="rounded-2xl border-2 border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-heading">
                  <span className="text-dot-a font-semibold">{idea.dot_a}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-dot-b font-semibold">{idea.dot_b}</span>
                </div>
                <p className="text-sm font-body">{idea.idea_text}</p>
                {(idea.media_urls && idea.media_urls.length > 0) && (
                  <div className="grid grid-cols-2 gap-2">
                    {idea.media_urls.map((url, idx) => (
                      /\.(mp4)$/i.test(url) ? (
                        <video key={idx} src={url} controls className="w-full rounded-xl border border-border max-h-64 object-cover" />
                      ) : (
                        <img key={idx} src={url} alt="" className="w-full rounded-xl border border-border max-h-64 object-cover" loading="lazy" />
                      )
                    ))}
                  </div>
                )}
                {idea.attached_file_url && !idea.media_urls?.length && (
                  /\.(jpg|jpeg|png)$/i.test(idea.attached_file_url) ? (
                    <img src={idea.attached_file_url} alt="" className="w-full max-h-64 object-cover rounded-xl border border-border" loading="lazy" />
                  ) : null
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
