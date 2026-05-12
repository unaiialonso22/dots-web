import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Moon, Sun, Crown, Menu, X, MessageCircle, Globe } from "lucide-react";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import { useState } from "react";

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { path: "/challenge", label: t("nav_daily_challenge") },
    { path: "/improve", label: t("nav_improve") },
    { path: "/training", label: t("nav_training"), premium: true },
    { path: "/feed", label: t("nav_community") },
    { path: "/messages", label: t("nav_messages"), icon: "messages" },
    { path: "/portfolio", label: t("nav_profile") },
    { path: "/blog/bloqueo-creativo", label: "Blog" },
    { path: "/premium", label: t("nav_premium") },
  ];

  const toggleLang = () => setLang(lang === "es" ? "en" : "es");

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logo variant="icon" size="md" />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`text-xs font-heading ${
                location.pathname === item.path ? "bg-muted font-semibold" : ""
              } ${item.path === "/premium" ? "text-premium" : ""}`}
            >
              {item.path === "/premium" && <Crown className="w-3 h-3 mr-1" />}
              {item.icon === "messages" && <MessageCircle className="w-3 h-3 mr-1" />}
              {item.label}
            </Button>
          ))}
          {user && <NotificationCenter />}
          <Button variant="ghost" size="icon" onClick={toggleLang} title={lang === "es" ? "Switch to English" : "Cambiar a Español"}>
            <Globe className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              {t("nav_enter")}
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-1">
          {user && <NotificationCenter />}
          <Button variant="ghost" size="icon" onClick={toggleLang}>
            <Globe className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-6 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full justify-start text-sm font-heading ${
                    location.pathname === item.path ? "bg-muted font-semibold" : ""
                  } ${item.path === "/premium" ? "text-premium" : ""}`}
                >
                  {item.path === "/premium" && <Crown className="w-3 h-3 mr-1" />}
                  {item.label}
                </Button>
              ))}
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav_logout")}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full justify-start">
                  {t("nav_enter")}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
