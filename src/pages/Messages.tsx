import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Send, ArrowLeft, MessageCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AppNav from "@/components/AppNav";

interface ConversationPreview {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  created_at: string;
  is_read: boolean;
}

interface ProfileInfo {
  display_name: string | null;
  avatar_url: string | null;
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

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; display_name: string | null; avatar_url: string | null }[]>([]);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: allMessages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!allMessages || allMessages.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Group by conversation partner
    const convMap = new Map<string, { messages: any[]; unread: number }>();
    allMessages.forEach((msg: any) => {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { messages: [], unread: 0 });
      }
      const conv = convMap.get(partnerId)!;
      conv.messages.push(msg);
      if (!msg.is_read && msg.receiver_id === user.id) conv.unread++;
    });

    // Load profiles for partners
    const partnerIds = [...convMap.keys()];
    const { data: partnerProfiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", partnerIds);

    const profileMap: Record<string, ProfileInfo> = {};
    partnerProfiles?.forEach((p: any) => {
      profileMap[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url };
    });
    setProfiles(profileMap);

    const convList: ConversationPreview[] = [];
    convMap.forEach((conv, partnerId) => {
      const lastMsg = conv.messages[0];
      const profile = profileMap[partnerId];
      convList.push({
        partnerId,
        partnerName: profile?.display_name || "Usuario",
        partnerAvatar: profile?.avatar_url || null,
        lastMessage: lastMsg.message_text,
        lastMessageAt: lastMsg.created_at,
        unread: conv.unread,
      });
    });

    convList.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    setConversations(convList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
          if (activeChat && (newMsg.sender_id === activeChat || newMsg.receiver_id === activeChat)) {
            setMessages((prev) => [...prev, newMsg]);
            // Mark as read if we're the receiver
            if (newMsg.receiver_id === user.id) {
              supabase.from("messages").update({ is_read: true } as any).eq("id", newMsg.id).then();
            }
          }
          loadConversations();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat, loadConversations]);

  // Load chat messages
  const openChat = async (partnerId: string) => {
    if (!user) return;
    setActiveChat(partnerId);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages((data || []) as Message[]);

    // Mark unread as read
    await supabase
      .from("messages")
      .update({ is_read: true } as any)
      .eq("sender_id", partnerId)
      .eq("receiver_id", user.id)
      .eq("is_read", false);

    loadConversations();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !activeChat || !newMessage.trim()) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: activeChat,
      message_text: newMessage.trim(),
    } as any);

    if (error) {
      toast.error("Error al enviar el mensaje.");
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .neq("id", user.id)
      .ilike("display_name", `%${searchQuery.trim()}%`)
      .limit(10);
    setSearchResults(data || []);
    setSearching(false);
  };

  const startConversation = (partnerId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    openChat(partnerId);
    // Ensure profile is in state
    const existing = searchResults.find((r) => r.id === partnerId);
    if (existing) {
      setProfiles((prev) => ({
        ...prev,
        [partnerId]: { display_name: existing.display_name, avatar_url: existing.avatar_url },
      }));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-heading">Cargando...</p>
      </div>
    );
  }

  const activeChatProfile = profiles[activeChat || ""];

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Chat header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <button onClick={() => setActiveChat(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                  {activeChatProfile?.avatar_url ? (
                    <img src={activeChatProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="font-heading font-semibold">{activeChatProfile?.display_name || "Usuario"}</p>
              </div>

              {/* Messages */}
              <div className="space-y-3 mb-4 max-h-[55vh] overflow-y-auto pr-1">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Envía el primer mensaje para empezar la conversación.
                  </p>
                )}
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-body ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p>{msg.message_text}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Send input */}
              <div className="flex items-center gap-2 border-t border-border pt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !sending && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                  disabled={sending}
                />
                <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim() || sending} className="rounded-full h-10 w-10">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-heading font-bold mb-1">Mensajes</h1>
                <p className="text-sm text-muted-foreground">Conversaciones privadas con otros creativos</p>
              </div>

              {/* Search users */}
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Buscar usuario..."
                    className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <Button size="sm" onClick={handleSearch} disabled={searching}>Buscar</Button>
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-2">Resultados</p>
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => startConversation(r.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                        {r.avatar_url ? (
                          <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-heading font-semibold text-sm">{r.display_name || "Usuario"}</p>
                      <MessageCircle className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation list */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-heading">Cargando conversaciones...</p>
                </div>
              ) : conversations.length === 0 && searchResults.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground font-heading">No tienes conversaciones aún</p>
                  <p className="text-sm text-muted-foreground">Busca un usuario para empezar a chatear</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <button
                      key={conv.partnerId}
                      onClick={() => openChat(conv.partnerId)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                          {conv.partnerAvatar ? (
                            <img src={conv.partnerAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-heading font-semibold text-sm truncate">{conv.partnerName}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{timeAgo(conv.lastMessageAt)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Messages;
