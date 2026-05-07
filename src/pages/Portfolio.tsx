import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Star, StarOff, Pencil, Camera, X, Check, FolderPlus, Folder, FolderOpen,
  MoreHorizontal, Trash2, Edit3, ChevronRight, Lock, Globe, ImagePlus, Play, Bookmark, BookmarkX,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import LevelBadge from "@/components/LevelBadge";
import LevelsRoadmap from "@/components/LevelsRoadmap";
import StreakBadge from "@/components/StreakBadge";

interface IdeaRow {
  id: string;
  dot_a: string;
  dot_b: string;
  idea_text: string;
  originality: number;
  insight: number;
  campaign_potential: number;
  created_at: string;
  is_training: boolean;
  is_improved?: boolean;
  is_public?: boolean;
  folder_id?: string | null;
  media_urls?: string[] | null;
}

interface FolderRow {
  id: string;
  name: string;
  created_at: string;
}

interface ProfileData {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  current_streak: number;
  longest_streak: number;
}

function scoreColor(score: number) {
  if (score >= 8) return "text-score-high";
  if (score >= 5) return "text-score-mid";
  return "text-score-low";
}

const Portfolio = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [portfolioIds, setPortfolioIds] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"portfolio" | "all" | "folders" | "inspiracion" | "niveles">("portfolio");
  const [savedIdeas, setSavedIdeas] = useState<(IdeaRow & { owner_name?: string; owner_avatar?: string; unavailable?: boolean })[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Folder management state
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [movingIdeaId, setMovingIdeaId] = useState<string | null>(null);
  const [deletingIdeaId, setDeletingIdeaId] = useState<string | null>(null);

  // Media editing state
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFileAdd = async (e: React.ChangeEvent<HTMLInputElement>, ideaId: string) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !user) return;
    const idea = ideas.find((i) => i.id === ideaId);
    const currentUrls = idea?.media_urls || [];
    const maxNew = 3 - currentUrls.length;
    if (maxNew <= 0) { toast.error("Máximo 3 archivos por idea."); return; }
    const validTypes = ["image/jpeg", "image/png", "video/mp4"];
    const toUpload: File[] = [];
    for (const file of files.slice(0, maxNew)) {
      if (!validTypes.includes(file.type)) { toast.error("Solo JPG, PNG o MP4."); continue; }
      if (file.size > 100 * 1024 * 1024) { toast.error("El archivo supera el tamaño máximo de 100MB."); continue; }
      toUpload.push(file);
    }
    if (!toUpload.length) return;
    setUploadingMedia(true);
    try {
      const newUrls: string[] = [];
      for (const file of toUpload) {
        const ext = file.name.split(".").pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("idea-attachments").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("idea-attachments").getPublicUrl(filePath);
        newUrls.push(urlData.publicUrl);
      }
      const updatedUrls = [...currentUrls, ...newUrls];
      await supabase.from("ideas").update({ media_urls: updatedUrls } as any).eq("id", ideaId);
      setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, media_urls: updatedUrls } : i));
      toast.success("¡Archivos añadidos!");
    } catch (e) {
      console.error(e);
      toast.error("Error al subir los archivos.");
    } finally {
      setUploadingMedia(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  const handleMediaRemove = async (ideaId: string, urlIndex: number) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea?.media_urls) return;
    const updatedUrls = idea.media_urls.filter((_, i) => i !== urlIndex);
    await supabase.from("ideas").update({ media_urls: updatedUrls.length ? updatedUrls : [] } as any).eq("id", ideaId);
    setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, media_urls: updatedUrls } : i));
    toast.success("Archivo eliminado.");
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [ideasRes, portfolioRes, profileRes, foldersRes, followersRes, followingRes, savedRes] = await Promise.all([
      supabase.from("ideas").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("portfolio_selections").select("idea_id").eq("user_id", user.id),
      supabase.from("profiles").select("display_name, username, avatar_url, bio, current_streak, longest_streak").eq("id", user.id).single(),
      supabase.from("folders").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", user.id),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", user.id),
      supabase.from("saved_ideas").select("idea_id").eq("user_id", user.id),
    ]);
    if (ideasRes.data) setIdeas(ideasRes.data as IdeaRow[]);
    if (portfolioRes.data) setPortfolioIds(new Set(portfolioRes.data.map((p: any) => p.idea_id)));
    if (profileRes.data) {
      const p = profileRes.data as any;
      setProfile(p);
      setEditName(p.display_name || "");
      setEditUsername(p.username || "");
      setEditBio(p.bio || "");
    }
    if (foldersRes.data) setFolders(foldersRes.data as FolderRow[]);
    setFollowerCount(followersRes.count || 0);
    setFollowingCount(followingRes.count || 0);

    // Load saved/inspiration ideas with dependency check
    if (savedRes.data && savedRes.data.length > 0) {
      const savedIdeaIds = savedRes.data.map((s: any) => s.idea_id);
      const { data: savedIdeasData } = await supabase
        .from("ideas")
        .select("id, dot_a, dot_b, idea_text, originality, insight, campaign_potential, created_at, is_training, is_improved, is_public, folder_id, media_urls, user_id")
        .in("id", savedIdeaIds)
        .eq("is_shared", true);

      const availableIds = new Set((savedIdeasData || []).map((i: any) => i.id));
      const ownerIds = [...new Set((savedIdeasData || []).map((i: any) => i.user_id))];
      
      let profilesMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
      if (ownerIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", ownerIds);
        if (profiles) profiles.forEach((p: any) => { profilesMap[p.id] = p; });
      }

      const result = savedIdeaIds.map((id: string) => {
        const idea = (savedIdeasData || []).find((i: any) => i.id === id);
        if (!idea || !availableIds.has(id)) {
          return { id, dot_a: "", dot_b: "", idea_text: "", originality: 0, insight: 0, campaign_potential: 0, created_at: "", is_training: false, unavailable: true };
        }
        const owner = profilesMap[idea.user_id] || { display_name: null, avatar_url: null };
        return { ...idea, owner_name: (owner as any).display_name || "Usuario", owner_avatar: (owner as any).avatar_url || null, unavailable: false };
      });
      setSavedIdeas(result);
    } else {
      setSavedIdeas([]);
    }

    setLoading(false);
  };

  // Avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast.error("Solo se permiten imágenes."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("La imagen no puede superar los 5 MB."); return; }
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
      setProfile((prev) => prev ? { ...prev, avatar_url: urlData.publicUrl } : prev);
      toast.success("¡Foto de perfil actualizada!");
    } catch (e) { console.error("Avatar upload error:", e); toast.error("Error al subir la imagen."); }
    finally { setUploadingAvatar(false); }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: editName.trim() || null, username: editUsername.trim() || null, bio: editBio.trim() || null,
      } as any).eq("id", user.id);
      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, display_name: editName.trim() || null, username: editUsername.trim() || null, bio: editBio.trim() || null } : prev);
      setEditing(false);
      toast.success("Perfil actualizado.");
    } catch (e) { toast.error("Error al guardar el perfil."); }
    finally { setSavingProfile(false); }
  };

  // Portfolio toggle – only public ideas allowed
  const togglePortfolio = async (ideaId: string) => {
    if (!user) return;
    const isSelected = portfolioIds.has(ideaId);
    if (isSelected) {
      await supabase.from("portfolio_selections").delete().eq("idea_id", ideaId).eq("user_id", user.id);
      setPortfolioIds((prev) => { const next = new Set(prev); next.delete(ideaId); return next; });
      toast.success("Eliminada del portfolio");
    } else {
      const idea = ideas.find((i) => i.id === ideaId);
      if (!idea?.is_public) { toast.error("Solo puedes añadir ideas públicas al portfolio."); return; }
      if (portfolioIds.size >= 10) { toast.error("Máximo 10 ideas en tu portfolio."); return; }
      await supabase.from("portfolio_selections").insert({ user_id: user.id, idea_id: ideaId, position: portfolioIds.size });
      setPortfolioIds((prev) => new Set(prev).add(ideaId));
      toast.success("¡Añadida al portfolio público!");
    }
  };

  // Folder management
  const handleCreateFolder = async () => {
    if (!user || !newFolderName.trim()) return;
    try {
      const { data, error } = await supabase.from("folders").insert({
        user_id: user.id, name: newFolderName.trim(),
      } as any).select("*").single();
      if (error) throw error;
      if (data) setFolders((prev) => [...prev, data as FolderRow]);
      setNewFolderName("");
      setShowNewFolder(false);
      toast.success("Carpeta creada.");
    } catch (e) { toast.error("Error al crear la carpeta."); }
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!renameFolderName.trim()) return;
    try {
      await supabase.from("folders").update({ name: renameFolderName.trim() } as any).eq("id", folderId);
      setFolders((prev) => prev.map((f) => f.id === folderId ? { ...f, name: renameFolderName.trim() } : f));
      setRenamingFolderId(null);
      toast.success("Carpeta renombrada.");
    } catch (e) { toast.error("Error al renombrar."); }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Unassign ideas from this folder
      await supabase.from("ideas").update({ folder_id: null } as any).eq("folder_id", folderId);
      await supabase.from("folders").delete().eq("id", folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      setIdeas((prev) => prev.map((i) => i.folder_id === folderId ? { ...i, folder_id: null } : i));
      if (selectedFolderId === folderId) setSelectedFolderId(null);
      toast.success("Carpeta eliminada.");
    } catch (e) { toast.error("Error al eliminar la carpeta."); }
  };

  const handleMoveIdea = async (ideaId: string, folderId: string | null) => {
    try {
      await supabase.from("ideas").update({ folder_id: folderId } as any).eq("id", ideaId);
      setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, folder_id: folderId } : i));
      setMovingIdeaId(null);
      toast.success(folderId ? "Idea movida a la carpeta." : "Idea sacada de la carpeta.");
    } catch (e) { toast.error("Error al mover la idea."); }
  };

  // Delete idea
  const handleDeleteIdea = async (ideaId: string) => {
    if (!user) return;
    try {
      // Remove from portfolio if present
      if (portfolioIds.has(ideaId)) {
        await supabase.from("portfolio_selections").delete().eq("idea_id", ideaId).eq("user_id", user.id);
        setPortfolioIds((prev) => { const next = new Set(prev); next.delete(ideaId); return next; });
      }
      await supabase.from("ideas").delete().eq("id", ideaId).eq("user_id", user.id);
      setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
      setDeletingIdeaId(null);
      toast.success("Idea eliminada.");
    } catch (e) { toast.error("Error al eliminar la idea."); }
  };

  // Toggle privacy
  const handleTogglePrivacy = async (ideaId: string, currentlyPublic: boolean) => {
    if (!user) return;
    try {
      if (currentlyPublic) {
        // Make private: also remove from portfolio and unshare
        if (portfolioIds.has(ideaId)) {
          await supabase.from("portfolio_selections").delete().eq("idea_id", ideaId).eq("user_id", user.id);
          setPortfolioIds((prev) => { const next = new Set(prev); next.delete(ideaId); return next; });
        }
        await supabase.from("ideas").update({ is_public: false, is_shared: false } as any).eq("id", ideaId);
        setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, is_public: false, is_shared: false } : i));
        toast.success("Idea marcada como privada. Se ha retirado del portfolio si estaba.");
      } else {
        await supabase.from("ideas").update({ is_public: true, is_shared: true } as any).eq("id", ideaId);
        setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, is_public: true, is_shared: true } : i));
        toast.success("Idea marcada como pública. Ahora aparece en la comunidad.");
      }
    } catch (e) { toast.error("Error al cambiar la privacidad."); }
  };

  const handleUnsaveIdea = async (ideaId: string) => {
    if (!user) return;
    await supabase.from("saved_ideas").delete().eq("user_id", user.id).eq("idea_id", ideaId);
    setSavedIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    toast.success("Idea eliminada de Inspiración.");
  };

  const getDisplayedIdeas = () => {
    if (tab === "portfolio") return ideas.filter((i) => portfolioIds.has(i.id));
    if (tab === "folders" && selectedFolderId) return ideas.filter((i) => i.folder_id === selectedFolderId);
    if (tab === "folders") return [];
    return ideas;
  };
  const displayedIdeas = getDisplayedIdeas();
  const unfiledIdeas = ideas.filter((i) => !i.folder_id);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-heading">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-8">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full bg-muted border-4 border-border overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-heading font-bold text-muted-foreground">{(profile?.display_name || "?")[0].toUpperCase()}</span>
              )}
            </div>
            <button onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
            <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
          </div>

          {editing ? (
            <div className="w-full max-w-sm space-y-3">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre"
                className="w-full rounded-xl border-2 border-border bg-card p-2.5 text-sm font-body text-center focus:outline-none focus:border-primary/40" />
              <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="@usuario"
                className="w-full rounded-xl border-2 border-border bg-card p-2.5 text-sm font-body text-center focus:outline-none focus:border-primary/40" />
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tu bio creativa..." maxLength={160}
                className="w-full rounded-xl border-2 border-border bg-card p-2.5 text-sm font-body text-center focus:outline-none focus:border-primary/40 resize-none min-h-[60px]" />
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X className="w-3 h-3 mr-1" /> Cancelar</Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile}>
                  <Check className="w-3 h-3 mr-1" /> {savingProfile ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-heading font-bold">{profile?.display_name || "Sin nombre"}</h1>
              {profile?.username && <p className="text-sm text-muted-foreground font-heading">@{profile.username}</p>}
              {profile?.bio && <p className="text-sm text-muted-foreground font-body mt-1 max-w-sm">{profile.bio}</p>}
              <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => setEditing(true)}>
                <Pencil className="w-3 h-3" /> Editar perfil
              </Button>
            </>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 mt-6 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{ideas.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ideas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{portfolioIds.size}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Portfolio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{followerCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold">{followingCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Siguiendo</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <LevelBadge totalIdeas={ideas.filter(i => i.is_public).length} showProgress size="md" />
            <StreakBadge currentStreak={profile?.current_streak || 0} longestStreak={profile?.longest_streak || 0} />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          <Button variant={tab === "portfolio" ? "default" : "outline"} size="sm" onClick={() => { setTab("portfolio"); setSelectedFolderId(null); }}>
            <Globe className="w-3 h-3 mr-1" /> Portfolio ({portfolioIds.size}/10)
          </Button>
          <Button variant={tab === "folders" ? "default" : "outline"} size="sm" onClick={() => { setTab("folders"); setSelectedFolderId(null); }}>
            <Folder className="w-3 h-3 mr-1" /> Carpetas
          </Button>
          <Button variant={tab === "all" ? "default" : "outline"} size="sm" onClick={() => { setTab("all"); setSelectedFolderId(null); }}>
            Todas ({ideas.length})
          </Button>
          <Button variant={tab === "inspiracion" ? "default" : "outline"} size="sm" onClick={() => { setTab("inspiracion"); setSelectedFolderId(null); }}>
            <Bookmark className="w-3 h-3 mr-1" /> Inspiración ({savedIdeas.filter(s => !s.unavailable).length})
          </Button>
          <Button variant={tab === "niveles" ? "default" : "outline"} size="sm" onClick={() => { setTab("niveles"); setSelectedFolderId(null); }}>
            🏆 Niveles
          </Button>
        </div>

        {/* Levels Roadmap */}
        {tab === "niveles" && (
          <div className="mb-6">
            <LevelsRoadmap totalIdeas={ideas.filter(i => i.is_public).length} />
          </div>
        )}

        {/* Folders view */}
        {tab === "folders" && !selectedFolderId && (
          <div className="space-y-3 mb-6">
            {folders.map((folder) => (
              <div key={folder.id} className="rounded-xl border-2 border-border bg-card p-4 flex items-center justify-between">
                {renamingFolderId === folder.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="text" value={renameFolderName} onChange={(e) => setRenameFolderName(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background p-2 text-sm font-body focus:outline-none focus:border-primary/40"
                      autoFocus onKeyDown={(e) => e.key === "Enter" && handleRenameFolder(folder.id)} />
                    <Button size="sm" onClick={() => handleRenameFolder(folder.id)}><Check className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setRenamingFolderId(null)}><X className="w-3 h-3" /></Button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setSelectedFolderId(folder.id)} className="flex items-center gap-3 flex-1 text-left hover:text-primary transition-colors">
                      <FolderOpen className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-heading font-semibold">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">{ideas.filter((i) => i.folder_id === folder.id).length} ideas</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => { setRenamingFolderId(folder.id); setRenameFolderName(folder.name); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDeleteFolder(folder.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Unfiled ideas */}
            {unfiledIdeas.length > 0 && (
              <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-4 flex items-center gap-3">
                <Folder className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-heading font-semibold text-muted-foreground">Sin carpeta</p>
                  <p className="text-xs text-muted-foreground">{unfiledIdeas.length} ideas</p>
                </div>
              </div>
            )}

            {/* New folder */}
            {showNewFolder ? (
              <div className="rounded-xl border-2 border-primary/30 bg-card p-4 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" />
                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nombre de la carpeta"
                  className="flex-1 rounded-lg border border-border bg-background p-2 text-sm font-body focus:outline-none focus:border-primary/40"
                  autoFocus onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()} />
                <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Crear</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowNewFolder(false); setNewFolderName(""); }}><X className="w-3 h-3" /></Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full gap-2" onClick={() => setShowNewFolder(true)}>
                <FolderPlus className="w-4 h-4" /> Nueva carpeta
              </Button>
            )}
          </div>
        )}

        {/* Folder breadcrumb */}
        {tab === "folders" && selectedFolderId && (
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setSelectedFolderId(null)} className="text-sm text-primary hover:underline font-heading">Carpetas</button>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-heading font-semibold">{folders.find((f) => f.id === selectedFolderId)?.name}</span>
          </div>
        )}

        {/* Inspiración tab */}
        {tab === "inspiracion" && (
          savedIdeas.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-heading">No has guardado ideas de otros creativos</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/feed")}>Explorar comunidad</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedIdeas.map((idea, i) => {
                if (idea.unavailable) {
                  return (
                    <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-2xl border-2 border-border bg-muted/50 p-5 flex flex-col items-center justify-center text-center min-h-[120px]">
                      <p className="text-sm text-muted-foreground font-heading">Esta idea ya no está disponible.</p>
                      <Button size="sm" variant="ghost" className="mt-2 text-xs text-muted-foreground" onClick={() => handleUnsaveIdea(idea.id)}>
                        <BookmarkX className="w-3 h-3 mr-1" /> Eliminar
                      </Button>
                    </motion.div>
                  );
                }
                return (
                  <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-2xl border-2 border-border bg-card p-5 space-y-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                        {idea.owner_avatar ? (
                          <img src={idea.owner_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-heading font-bold text-muted-foreground">{(idea.owner_name || "?")[0].toUpperCase()}</span>
                        )}
                      </div>
                      <span className="text-xs font-heading text-muted-foreground">{idea.owner_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-heading">
                      <span className="text-dot-a font-semibold">{idea.dot_a}</span>
                      <span className="text-muted-foreground">+</span>
                      <span className="text-dot-b font-semibold">{idea.dot_b}</span>
                    </div>
                    <p className="text-sm font-body line-clamp-3">{idea.idea_text}</p>
                    {idea.media_urls && idea.media_urls.length > 0 && (
                      <div className="flex gap-2">
                        {idea.media_urls.map((url, idx) => {
                          const isVideo = url.match(/\.mp4$/i);
                          return isVideo ? (
                            <video key={idx} src={url} controls className="rounded-lg max-h-28 max-w-[140px] object-cover" />
                          ) : (
                            <img key={idx} src={url} alt="" className="rounded-lg max-h-28 max-w-[140px] object-cover" />
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-heading text-muted-foreground">
                        <span>Orig: {idea.originality}</span>
                        <span>Conexión: {idea.insight}</span>
                        <span>Potencial: {idea.campaign_potential}</span>
                      </div>
                      <button onClick={() => handleUnsaveIdea(idea.id)}
                        className="p-1 hover:bg-destructive/10 rounded-lg transition-colors" title="Eliminar de Inspiración">
                        <BookmarkX className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}

        {/* Ideas list */}
        {tab !== "inspiracion" && (tab !== "folders" || selectedFolderId) && (
          displayedIdeas.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-heading">
                {tab === "portfolio" ? "No has seleccionado ideas para tu portfolio" :
                  tab === "folders" ? "Esta carpeta está vacía" : "Aún no has enviado ideas"}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/challenge")}>Empezar un reto</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {displayedIdeas.map((idea, i) => {
                  const isInPortfolio = portfolioIds.has(idea.id);
                  const avg = ((idea.originality + idea.insight + idea.campaign_potential) / 3).toFixed(1);
                  const ideaFolder = folders.find((f) => f.id === idea.folder_id);

                  return (
                    <motion.div key={idea.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.03 }} className="rounded-2xl border-2 border-border bg-card p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-heading">
                            <span className="text-dot-a font-semibold">{idea.dot_a}</span>
                            <span className="text-muted-foreground">+</span>
                            <span className="text-dot-b font-semibold">{idea.dot_b}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {idea.is_training && (
                              <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-heading text-muted-foreground">Entrenamiento</span>
                            )}
                            {idea.is_improved && (
                              <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-heading">Mejorada con IA</span>
                            )}
                            {idea.is_public ? (
                              <span className="text-[10px] bg-score-high/10 text-score-high rounded px-1.5 py-0.5 font-heading flex items-center gap-0.5">
                                <Globe className="w-2.5 h-2.5" /> Pública
                              </span>
                            ) : (
                              <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-heading text-muted-foreground flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Privada
                              </span>
                            )}
                            {isInPortfolio && (
                              <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-heading flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5" /> Portfolio
                              </span>
                            )}
                            {ideaFolder && (
                              <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-heading text-muted-foreground flex items-center gap-0.5">
                                <Folder className="w-2.5 h-2.5" /> {ideaFolder.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {/* Privacy toggle */}
                          <button onClick={() => handleTogglePrivacy(idea.id, !!idea.is_public)}
                            className="p-1 hover:bg-muted rounded-lg transition-colors"
                            title={idea.is_public ? "Hacer privada" : "Hacer pública"}>
                            {idea.is_public ? <Globe className="w-4 h-4 text-score-high" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          {/* Move to folder */}
                          <div className="relative">
                            <button onClick={() => setMovingIdeaId(movingIdeaId === idea.id ? null : idea.id)}
                              className="p-1 hover:bg-muted rounded-lg transition-colors" title="Mover a carpeta">
                              <FolderPlus className="w-4 h-4 text-muted-foreground" />
                            </button>
                            {movingIdeaId === idea.id && (
                              <div className="absolute right-0 top-8 z-10 bg-card border-2 border-border rounded-xl shadow-lg p-2 min-w-[160px]">
                                {idea.folder_id && (
                                  <button onClick={() => handleMoveIdea(idea.id, null)}
                                    className="w-full text-left px-3 py-2 text-xs font-heading hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                                    Sin carpeta
                                  </button>
                                )}
                                {folders.filter((f) => f.id !== idea.folder_id).map((f) => (
                                  <button key={f.id} onClick={() => handleMoveIdea(idea.id, f.id)}
                                    className="w-full text-left px-3 py-2 text-xs font-heading hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                                    <Folder className="w-3 h-3" /> {f.name}
                                  </button>
                                ))}
                                {folders.length === 0 && !idea.folder_id && (
                                  <p className="px-3 py-2 text-xs text-muted-foreground">No hay carpetas</p>
                                )}
                              </div>
                            )}
                          </div>
                          {/* Portfolio toggle */}
                          <button onClick={() => togglePortfolio(idea.id)} className={`p-1 hover:scale-110 transition-transform ${!idea.is_public && !isInPortfolio ? 'opacity-40 cursor-not-allowed' : ''}`}
                            title={isInPortfolio ? "Quitar del portfolio" : idea.is_public ? "Añadir al portfolio" : "Haz la idea pública primero"}>
                            {isInPortfolio ? <Star className="w-5 h-5 text-primary fill-primary" /> : <StarOff className="w-5 h-5 text-muted-foreground" />}
                          </button>
                          {/* Delete */}
                          <div className="relative">
                            {deletingIdeaId === idea.id ? (
                              <div className="absolute right-0 top-8 z-10 bg-card border-2 border-destructive/30 rounded-xl shadow-lg p-3 min-w-[180px]">
                                <p className="text-xs font-heading font-medium mb-2">¿Eliminar esta idea?</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setDeletingIdeaId(null)}>Cancelar</Button>
                                  <Button size="sm" variant="destructive" className="flex-1 text-xs" onClick={() => handleDeleteIdea(idea.id)}>Eliminar</Button>
                                </div>
                              </div>
                            ) : null}
                            <button onClick={() => setDeletingIdeaId(deletingIdeaId === idea.id ? null : idea.id)}
                              className="p-1 hover:bg-destructive/10 rounded-lg transition-colors" title="Eliminar idea">
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-body">{idea.idea_text}</p>

                      {/* Media display */}
                      {idea.media_urls && idea.media_urls.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {idea.media_urls.map((url, idx) => {
                            const isVideo = url.match(/\.mp4$/i);
                            return (
                              <div key={idx} className="relative group/media">
                                {isVideo ? (
                                  <video src={url} controls className="rounded-lg max-h-40 max-w-[200px] object-cover" />
                                ) : (
                                  <img src={url} alt="Media" className="rounded-lg max-h-40 max-w-[200px] object-cover" />
                                )}
                                {editingMediaId === idea.id && (
                                  <button onClick={() => handleMediaRemove(idea.id, idx)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs shadow-md hover:scale-110 transition-transform">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Media edit panel */}
                      {editingMediaId === idea.id && (
                        <div className="flex items-center gap-2 pt-1">
                          <input ref={mediaInputRef} type="file" accept="image/jpeg,image/png,video/mp4" multiple
                            onChange={(e) => handleMediaFileAdd(e, idea.id)} className="hidden" />
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs"
                            onClick={() => mediaInputRef.current?.click()} disabled={uploadingMedia || (idea.media_urls?.length || 0) >= 3}>
                            <ImagePlus className="w-3.5 h-3.5" />
                            {uploadingMedia ? "Subiendo..." : "Añadir archivo"}
                          </Button>
                          <span className="text-[10px] text-muted-foreground">{idea.media_urls?.length || 0}/3 archivos</span>
                          <Button size="sm" variant="ghost" className="ml-auto text-xs" onClick={() => setEditingMediaId(null)}>Cerrar</Button>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs font-heading text-muted-foreground">
                        <span>Orig: {idea.originality}</span>
                        <span>Conexión: {idea.insight}</span>
                        <span>Potencial: {idea.campaign_potential}</span>
                        {/* Edit media button */}
                        <button onClick={() => setEditingMediaId(editingMediaId === idea.id ? null : idea.id)}
                          className="p-1 hover:bg-muted rounded-lg transition-colors ml-1" title="Editar archivos">
                          <ImagePlus className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </button>
                        <span className={`ml-auto font-bold text-sm ${scoreColor(Number(avg))}`}>{avg}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Portfolio;
