import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Sparkles, UserCheck, Heart, MessageCircle, FileDown, Send, Trash2, TrendingUp, Award, Bookmark, CornerDownRight, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import { getSeedIdeas, getSeedProfiles, getSeedLikeCounts, getSeedComments, getSeedCommentCounts } from "@/lib/seed-feed";

interface FeedIdea {
  id: string;
  dot_a: string;
  dot_b: string;
  idea_text: string;
  created_at: string;
  user_id: string;
  attached_file_url: string | null;
  media_urls?: string[] | null;
}

interface Comment {
  id: string;
  idea_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
}

interface ProfileMap {
  [userId: string]: { display_name: string | null; avatar_url: string | null; total_ideas?: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}sem`;
}

/** Auth gate: redirects to /auth with a toast if not logged in */
function requireAuth(isLoggedIn: boolean, navigate: ReturnType<typeof useNavigate>, returnPath: string): boolean {
  if (!isLoggedIn) {
    toast("Crea una cuenta para interactuar con la comunidad.", { action: { label: "Registrarse", onClick: () => navigate("/auth", { state: { returnTo: returnPath } }) } });
    navigate("/auth", { state: { returnTo: returnPath } });
    return false;
  }
  return true;
}

function CommentItem({
  comment,
  replies,
  profiles,
  currentUserId,
  isLoggedIn,
  commentLikeCounts,
  commentLikedIds,
  onToggleCommentLike,
  onDeleteComment,
  onNavigateProfile,
  onReply,
  navigate,
}: {
  comment: Comment;
  replies: Comment[];
  profiles: ProfileMap;
  currentUserId: string | null;
  isLoggedIn: boolean;
  commentLikeCounts: Record<string, number>;
  commentLikedIds: Set<string>;
  onToggleCommentLike: (commentId: string) => void;
  onDeleteComment: (commentId: string, ideaId: string) => Promise<void>;
  onNavigateProfile: (userId: string) => void;
  onReply: (commentId: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const commentProfile = profiles[comment.user_id];
  const isCommentSeed = comment.user_id.startsWith("seed-");
  const liked = commentLikedIds.has(comment.id);
  const likeCount = commentLikeCounts[comment.id] || 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-2.5 group/comment">
        <button
          onClick={() => !isCommentSeed && onNavigateProfile(comment.user_id)}
          className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5 ${!isCommentSeed ? "cursor-pointer hover:ring-2 hover:ring-primary/30" : ""}`}
        >
          {commentProfile?.avatar_url ? (
            <img src={commentProfile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="bg-muted/50 rounded-xl px-3 py-2">
           <div className="flex items-center gap-1.5">
              <button
                onClick={() => !isCommentSeed && onNavigateProfile(comment.user_id)}
                className={`text-xs font-heading font-semibold ${!isCommentSeed ? "hover:text-primary cursor-pointer" : ""}`}
              >
                {commentProfile?.display_name || "Anónimo"}
              </button>
              {commentProfile?.total_ideas != null && <LevelBadge totalIdeas={commentProfile.total_ideas} />}
            </div>
            <p className="text-xs font-body text-foreground/80 mt-0.5">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1 px-1">
            <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
            <button
              onClick={() => {
                if (!requireAuth(isLoggedIn, navigate, "/feed")) return;
                onToggleCommentLike(comment.id);
              }}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className={`w-3 h-3 ${liked ? "text-destructive fill-destructive" : ""}`} />
              {likeCount > 0 && <span className={liked ? "text-destructive" : ""}>{likeCount}</span>}
            </button>
            <button
              onClick={() => {
                if (!requireAuth(isLoggedIn, navigate, "/feed")) return;
                onReply(comment.id);
              }}
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              Responder
            </button>
            {currentUserId === comment.user_id && (
              <button
                onClick={() => onDeleteComment(comment.id, comment.idea_id)}
                className="text-[10px] text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover/comment:opacity-100"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-8 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              profiles={profiles}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              commentLikeCounts={commentLikeCounts}
              commentLikedIds={commentLikedIds}
              onToggleCommentLike={onToggleCommentLike}
              onDeleteComment={onDeleteComment}
              onNavigateProfile={onNavigateProfile}
              onReply={onReply}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedCard({
  idea,
  index,
  profile,
  profiles,
  liked,
  likeCount,
  comments,
  commentCounts,
  commentLikeCounts,
  commentLikedIds,
  onToggleLike,
  onToggleCommentLike,
  onAddComment,
  onDeleteComment,
  onToggleFollow,
  onNavigateProfile,
  onSaveIdea,
  isLoggedIn,
  currentUserId,
  isFollowing,
  isFeatured,
  isSaved,
}: {
  idea: FeedIdea;
  index: number;
  profile: ProfileMap[string] | undefined;
  profiles: ProfileMap;
  liked: boolean;
  likeCount: number;
  comments: Comment[];
  commentCounts: Record<string, number>;
  commentLikeCounts: Record<string, number>;
  commentLikedIds: Set<string>;
  onToggleLike: (ideaId: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  onAddComment: (ideaId: string, content: string, parentId?: string | null) => Promise<void>;
  onDeleteComment: (commentId: string, ideaId: string) => Promise<void>;
  onToggleFollow: (userId: string) => void;
  onNavigateProfile: (userId: string) => void;
  onSaveIdea: (ideaId: string) => void;
  isLoggedIn: boolean;
  currentUserId: string | null;
  isFollowing: boolean;
  isFeatured?: boolean;
  isSaved?: boolean;
}) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const authorName = profile?.display_name || "Anónimo";
  
  // Top-level comments for this idea
  const ideaComments = comments.filter((c) => c.idea_id === idea.id && !c.parent_id);
  // Build replies map
  const repliesMap: Record<string, Comment[]> = {};
  comments.filter((c) => c.idea_id === idea.id && c.parent_id).forEach((c) => {
    if (!repliesMap[c.parent_id!]) repliesMap[c.parent_id!] = [];
    repliesMap[c.parent_id!].push(c);
  });
  
  const commentCount = commentCounts[idea.id] || 0;
  const isSeedUser = idea.user_id.startsWith("seed-");

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    await onAddComment(idea.id, commentText.trim(), replyingTo);
    setCommentText("");
    setReplyingTo(null);
    setSubmitting(false);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setShowComments(true);
  };

  const replyingToComment = replyingTo ? comments.find((c) => c.id === replyingTo) : null;
  const replyingToName = replyingToComment ? (profiles[replyingToComment.user_id]?.display_name || "Anónimo") : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
      className={`group rounded-2xl border-2 bg-card overflow-hidden transition-colors ${
        isFeatured ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border hover:border-primary/20"
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="bg-primary/10 px-5 py-1.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-heading font-semibold text-primary">Idea destacada</span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <button
          onClick={() => !isSeedUser && onNavigateProfile(idea.user_id)}
          className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 ${!isSeedUser ? "cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" : ""}`}
        >
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <div className="min-w-0">
          <button
            onClick={() => !isSeedUser && onNavigateProfile(idea.user_id)}
            className={`text-sm font-heading font-semibold leading-tight truncate block ${!isSeedUser ? "hover:text-primary transition-colors cursor-pointer" : ""}`}
          >
            {authorName}
          </button>
          {profile?.total_ideas != null && <LevelBadge totalIdeas={profile.total_ideas} />}
        </div>
        {isLoggedIn && currentUserId !== idea.user_id && !isSeedUser && (
          <button
            onClick={() => onToggleFollow(idea.user_id)}
            className={`text-[11px] font-heading font-semibold px-3 py-1 rounded-full border transition-colors flex-shrink-0 ${
              isFollowing
                ? "border-primary/30 text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
          </button>
        )}
        {!isLoggedIn && !isSeedUser && currentUserId !== idea.user_id && (
          <button
            onClick={() => requireAuth(false, navigate, "/feed")}
            className="text-[11px] font-heading font-semibold px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex-shrink-0"
          >
            Seguir
          </button>
        )}
        <span className={`text-[10px] text-muted-foreground font-heading flex-shrink-0 ${(isLoggedIn || !isLoggedIn) && currentUserId !== idea.user_id && !isSeedUser ? "" : "ml-auto"}`}>{timeAgo(idea.created_at)}</span>
      </div>

      {/* Dots */}
      <div className="px-5 pb-3">
        <div className="inline-flex items-center gap-2 bg-muted/60 rounded-full px-3 py-1.5">
          <span className="text-xs font-heading font-semibold text-dot-a">{idea.dot_a}</span>
          <span className="text-xs text-muted-foreground">×</span>
          <span className="text-xs font-heading font-semibold text-dot-b">{idea.dot_b}</span>
        </div>
      </div>

      {/* Idea text */}
      <div className="px-5 pb-4">
        <p className={`font-body leading-relaxed ${isFeatured ? "text-base" : "text-sm"}`}>{idea.idea_text}</p>

        {/* Media display - new media_urls */}
        {idea.media_urls && idea.media_urls.length > 0 && (
          <div className={`mt-3 ${idea.media_urls.length > 1 ? "grid grid-cols-2 gap-2" : ""}`}>
            {idea.media_urls.map((url, idx) => (
              /\.(mp4)$/i.test(url) ? (
                <video key={idx} src={url} controls className="w-full rounded-xl border border-border max-h-64 object-cover" />
              ) : (
                <img key={idx} src={url} alt="Adjunto" className="w-full max-h-64 object-cover rounded-xl border border-border" loading="lazy" />
              )
            ))}
          </div>
        )}

        {/* Legacy attached_file_url */}
        {idea.attached_file_url && (!idea.media_urls || idea.media_urls.length === 0) && (
          <div className="mt-3">
            {/\.(jpg|jpeg|png)$/i.test(idea.attached_file_url) ? (
              <img src={idea.attached_file_url} alt="Archivo adjunto"
                className="w-full max-h-64 object-cover rounded-xl border border-border" loading="lazy" />
            ) : /\.(mp4)$/i.test(idea.attached_file_url) ? (
              <video src={idea.attached_file_url} controls className="w-full rounded-xl border border-border max-h-64" />
            ) : (
              <a href={idea.attached_file_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-muted/60 rounded-lg px-3 py-2">
                <FileDown className="w-4 h-4" />Descargar PDF
              </a>
            )}
          </div>
        )}
      </div>

      {/* Actions bar */}
      <div className="px-5 py-3 border-t border-border/50 flex items-center gap-4">
        <button
          onClick={() => {
            if (!requireAuth(isLoggedIn, navigate, "/feed")) return;
            onToggleLike(idea.id);
          }}
          className="flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
          <span className={`text-xs font-heading font-medium ${liked ? "text-destructive" : "text-muted-foreground"}`}>
            {likeCount > 0 ? likeCount : ""} Me gusta
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className={`w-4 h-4 transition-colors ${showComments ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-xs font-heading font-medium ${showComments ? "text-primary" : "text-muted-foreground"}`}>
            {commentCount > 0 ? `${commentCount} ` : ""}Comentar
          </span>
        </button>

        {currentUserId !== idea.user_id && (
          <button
            onClick={() => {
              if (!requireAuth(isLoggedIn, navigate, "/feed")) return;
              onSaveIdea(idea.id);
            }}
            className="flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs font-heading font-medium ${isSaved ? "text-primary" : "text-muted-foreground"}`}>
              {isSaved ? "Guardada" : "Guardar"}
            </span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>Idea creativa</span>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50">
              {ideaComments.length > 0 && (
                <div className="px-5 pt-3 space-y-3">
                  {ideaComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      replies={repliesMap[comment.id] || []}
                      profiles={profiles}
                      currentUserId={currentUserId}
                      isLoggedIn={isLoggedIn}
                      commentLikeCounts={commentLikeCounts}
                      commentLikedIds={commentLikedIds}
                      onToggleCommentLike={onToggleCommentLike}
                      onDeleteComment={onDeleteComment}
                      onNavigateProfile={onNavigateProfile}
                      onReply={handleReply}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}

              {/* Comment input */}
              {isLoggedIn ? (
                <div className="px-5 py-3">
                  {replyingTo && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <CornerDownRight className="w-3 h-3 text-primary" />
                      <span className="text-[11px] text-muted-foreground">
                        Respondiendo a <span className="font-semibold text-foreground">{replyingToName}</span>
                      </span>
                      <button onClick={() => setReplyingTo(null)} className="text-[10px] text-muted-foreground hover:text-destructive ml-1">✕</button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {profiles[currentUserId || ""]?.avatar_url ? (
                        <img src={profiles[currentUserId || ""]?.avatar_url || ""} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmitComment()}
                      placeholder={replyingTo ? "Escribe tu respuesta..." : "Escribe un comentario..."}
                      className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                      disabled={submitting}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || submitting}
                      className="p-1.5 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-40"
                    >
                      <Send className={`w-4 h-4 ${commentText.trim() ? "text-primary" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-3">
                  <p className="text-xs text-muted-foreground text-center">
                    <button onClick={() => requireAuth(false, navigate, "/feed")} className="text-primary hover:underline">Inicia sesión</button> para comentar
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<FeedIdea[]>([]);
  const [followingIdeas, setFollowingIdeas] = useState<FeedIdea[]>([]);
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set());
  const [profiles, setProfiles] = useState<ProfileMap>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});
  const [commentLikedIds, setCommentLikedIds] = useState<Set<string>>(new Set());
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"explore" | "following">("explore");

  const loadFeed = useCallback(async () => {
    setLoading(true);

    const { data: ideasData } = await supabase
      .from("ideas")
      .select("*")
      .eq("is_shared", true)
      .order("created_at", { ascending: false })
      .limit(50);

    const realIdeas = (ideasData || []) as FeedIdea[];

    const seedIdeas = getSeedIdeas() as FeedIdea[];
    const allIdeas = [...realIdeas, ...seedIdeas].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setIdeas(allIdeas);

    const realUserIds = [...new Set(realIdeas.map((i) => i.user_id))];
    const realIdeaIds = realIdeas.map((i) => i.id);

    const [profilesRes, likesRes, myLikesRes, commentsRes] = await Promise.all([
      realUserIds.length > 0
        ? supabase.from("profiles").select("id, display_name, avatar_url").in("id", realUserIds)
        : Promise.resolve({ data: [] }),
      realIdeaIds.length > 0
        ? supabase.from("idea_likes").select("idea_id").in("idea_id", realIdeaIds)
        : Promise.resolve({ data: [] }),
      user && realIdeaIds.length > 0
        ? supabase.from("idea_likes").select("idea_id").eq("user_id", user.id).in("idea_id", realIdeaIds)
        : Promise.resolve({ data: [] }),
      realIdeaIds.length > 0
        ? supabase.from("idea_comments").select("*").in("idea_id", realIdeaIds).order("created_at", { ascending: true })
        : Promise.resolve({ data: [] }),
    ]);

    // Count PUBLIC ideas per user for level badges
    const userPublicIdeaCounts: Record<string, number> = {};
    realIdeas.forEach((i) => { userPublicIdeaCounts[i.user_id] = (userPublicIdeaCounts[i.user_id] || 0) + 1; });

    const map: ProfileMap = { ...getSeedProfiles() };
    profilesRes.data?.forEach((p: any) => {
      map[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url, total_ideas: userPublicIdeaCounts[p.id] || 0 };
    });

    const commentUserIds = [...new Set((commentsRes.data || []).map((c: any) => c.user_id))];
    const missingUserIds = commentUserIds.filter((id) => !map[id] && !realUserIds.includes(id));
    if (missingUserIds.length > 0) {
      const { data: extraProfiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", missingUserIds);
      extraProfiles?.forEach((p: any) => { map[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url }; });
    }
    if (user && !map[user.id]) {
      const { data: myProfile } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", user.id).single();
      if (myProfile) map[myProfile.id] = { display_name: myProfile.display_name, avatar_url: myProfile.avatar_url };
    }
    setProfiles(map);

    // Likes: merge real + seed
    const counts: Record<string, number> = { ...getSeedLikeCounts() };
    likesRes.data?.forEach((l: any) => { counts[l.idea_id] = (counts[l.idea_id] || 0) + 1; });
    setLikeCounts(counts);

    if (myLikesRes.data) {
      setLikedIds(new Set(myLikesRes.data.map((l: any) => l.idea_id)));
    }

    // Comments: merge real + seed
    const seedComments = getSeedComments() as Comment[];
    const allComments = [...(commentsRes.data || []) as Comment[], ...seedComments];
    setComments(allComments);
    const cCounts: Record<string, number> = { ...getSeedCommentCounts() };
    (commentsRes.data || []).forEach((c: any) => { cCounts[c.idea_id] = (cCounts[c.idea_id] || 0) + 1; });
    setCommentCounts(cCounts);

    // Load comment likes
    const realCommentIds = (commentsRes.data || []).map((c: any) => c.id);
    if (realCommentIds.length > 0) {
      const [clRes, myClRes] = await Promise.all([
        supabase.from("comment_likes").select("comment_id").in("comment_id", realCommentIds),
        user ? supabase.from("comment_likes").select("comment_id").eq("user_id", user.id).in("comment_id", realCommentIds) : Promise.resolve({ data: [] }),
      ]);
      const clCounts: Record<string, number> = {};
      (clRes.data || []).forEach((l: any) => { clCounts[l.comment_id] = (clCounts[l.comment_id] || 0) + 1; });
      setCommentLikeCounts(clCounts);
      if (myClRes.data) setCommentLikedIds(new Set(myClRes.data.map((l: any) => l.comment_id)));
    }

    // Compute featured ideas (top 3 by likes+comments in last 48h)
    const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
    const recentIdeas = allIdeas.filter((i) => new Date(i.created_at).getTime() > twoDaysAgo);
    const scored = recentIdeas.map((i) => ({
      id: i.id,
      score: (counts[i.id] || 0) * 2 + (cCounts[i.id] || 0),
    })).sort((a, b) => b.score - a.score).slice(0, 3);
    setFeaturedIds(new Set(scored.filter((s) => s.score > 0).map((s) => s.id)));

    // Load following list + saved ideas
    if (user) {
      const [followRes, savedRes] = await Promise.all([
        supabase.from("follows").select("following_id").eq("follower_id", user.id),
        supabase.from("saved_ideas").select("idea_id").eq("user_id", user.id),
      ]);
      const fIds = new Set((followRes.data || []).map((f: any) => f.following_id));
      setFollowingIds(fIds);
      setFollowingIdeas(realIdeas.filter((i) => fIds.has(i.user_id)));
      setSavedIds(new Set((savedRes.data || []).map((s: any) => s.idea_id)));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const toggleLike = async (ideaId: string) => {
    if (!user) return;
    const isLiked = likedIds.has(ideaId);

    setLikedIds((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(ideaId) : next.add(ideaId);
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [ideaId]: Math.max(0, (prev[ideaId] || 0) + (isLiked ? -1 : 1)),
    }));

    if (isLiked) {
      await supabase.from("idea_likes").delete().eq("idea_id", ideaId).eq("user_id", user.id);
    } else {
      await supabase.from("idea_likes").insert({ user_id: user.id, idea_id: ideaId });
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!user) return;
    const isLiked = commentLikedIds.has(commentId);

    setCommentLikedIds((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(commentId) : next.add(commentId);
      return next;
    });
    setCommentLikeCounts((prev) => ({
      ...prev,
      [commentId]: Math.max(0, (prev[commentId] || 0) + (isLiked ? -1 : 1)),
    }));

    if (isLiked) {
      await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id);
    } else {
      await supabase.from("comment_likes").insert({ user_id: user.id, comment_id: commentId } as any);
    }
  };

  const addComment = async (ideaId: string, content: string, parentId?: string | null) => {
    if (!user) return;
    const { data, error } = await supabase.from("idea_comments").insert({
      idea_id: ideaId,
      user_id: user.id,
      content,
      ...(parentId ? { parent_id: parentId } : {}),
    } as any).select("*").single();

    if (error) {
      toast.error("Error al publicar el comentario.");
      return;
    }
    if (data) {
      setComments((prev) => [...prev, data as Comment]);
      setCommentCounts((prev) => ({ ...prev, [ideaId]: (prev[ideaId] || 0) + 1 }));
      toast.success(parentId ? "Respuesta publicada." : "Comentario publicado.");
    }
  };

  const deleteComment = async (commentId: string, ideaId: string) => {
    // Also count replies that will be cascade-deleted
    const repliesCount = comments.filter((c) => c.parent_id === commentId).length;
    await supabase.from("idea_comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
    setCommentCounts((prev) => ({ ...prev, [ideaId]: Math.max(0, (prev[ideaId] || 0) - 1 - repliesCount) }));
    toast.success("Comentario eliminado.");
  };

  const toggleFollow = async (userId: string) => {
    if (!user) return;
    const isFollowing = followingIds.has(userId);
    setFollowingIds((prev) => {
      const next = new Set(prev);
      isFollowing ? next.delete(userId) : next.add(userId);
      return next;
    });

    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId);
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: userId } as any);
    }

    const realIdeas = ideas.filter((i) => !i.id.startsWith("seed-"));
    const updatedFollowingIds = new Set(followingIds);
    isFollowing ? updatedFollowingIds.delete(userId) : updatedFollowingIds.add(userId);
    setFollowingIdeas(realIdeas.filter((i) => updatedFollowingIds.has(i.user_id)));
  };

  const saveIdea = async (ideaId: string) => {
    if (!user) return;
    const alreadySaved = savedIds.has(ideaId);
    if (alreadySaved) {
      await supabase.from("saved_ideas").delete().eq("idea_id", ideaId).eq("user_id", user.id);
      setSavedIds((prev) => { const next = new Set(prev); next.delete(ideaId); return next; });
      toast.success("Idea eliminada de guardados.");
    } else {
      await supabase.from("saved_ideas").insert({ user_id: user.id, idea_id: ideaId } as any);
      setSavedIds((prev) => new Set(prev).add(ideaId));
      toast.success("⭐ Idea guardada en Inspiración.");
    }
  };

  const navigateToProfile = (userId: string) => {
    if (user?.id === userId) {
      navigate("/portfolio");
    } else {
      navigate(`/user/${userId}`);
    }
  };

  // Sort: featured first in explore tab, then chronological
  const getDisplayedIdeas = () => {
    if (tab === "following") return followingIdeas;
    const featured = ideas.filter((i) => featuredIds.has(i.id));
    const rest = ideas.filter((i) => !featuredIds.has(i.id));
    return [...featured, ...rest];
  };

  const displayedIdeas = getDisplayedIdeas();

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-heading font-bold mb-1">Comunidad</h1>
          <p className="text-sm text-muted-foreground">Descubre ideas creativas de la comunidad</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button variant={tab === "explore" ? "default" : "outline"} size="sm" onClick={() => setTab("explore")}>
            <Sparkles className="w-3 h-3 mr-1" />Explorar
          </Button>
          <Button variant={tab === "following" ? "default" : "outline"} size="sm" onClick={() => setTab("following")}>
            <UserCheck className="w-3 h-3 mr-1" />Siguiendo
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-heading">Cargando ideas...</p>
          </div>
        ) : displayedIdeas.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            {tab === "following" ? (
              <>
                <p className="text-muted-foreground font-heading">Aún no sigues a nadie</p>
                <p className="text-sm text-muted-foreground">Explora ideas y encuentra inspiración.</p>
                <Button onClick={() => setTab("explore")}>Explorar ideas</Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground font-heading">Aún no hay ideas compartidas</p>
                <p className="text-sm text-muted-foreground">¡Sé el primero en compartir una idea creativa!</p>
                <Button onClick={() => navigate("/challenge")}>Empezar un reto</Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {displayedIdeas.map((idea, i) => (
              <FeedCard
                key={idea.id}
                idea={idea}
                index={i}
                profile={profiles[idea.user_id]}
                profiles={profiles}
                liked={likedIds.has(idea.id)}
                likeCount={likeCounts[idea.id] || 0}
                comments={comments}
                commentCounts={commentCounts}
                commentLikeCounts={commentLikeCounts}
                commentLikedIds={commentLikedIds}
                onToggleLike={toggleLike}
                onToggleCommentLike={toggleCommentLike}
                onAddComment={addComment}
                onDeleteComment={deleteComment}
                onToggleFollow={toggleFollow}
                onNavigateProfile={navigateToProfile}
                onSaveIdea={saveIdea}
                isLoggedIn={!!user}
                currentUserId={user?.id || null}
                isFollowing={followingIds.has(idea.user_id)}
                isFeatured={tab === "explore" && featuredIds.has(idea.id)}
                isSaved={savedIds.has(idea.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
