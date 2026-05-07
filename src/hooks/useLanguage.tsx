import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import es from "@/lib/i18n/es";
import en from "@/lib/i18n/en";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Lang = "es" | "en";

const translations: Record<Lang, Record<string, string>> = { es, en };

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  t: (key) => key,
});

function detectBrowserLang(): Lang {
  const nav = navigator.language || (navigator as any).userLanguage || "es";
  return nav.startsWith("en") ? "en" : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("dots_lang") as Lang | null;
    return stored || detectBrowserLang();
  });

  // Load user preference from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("preferred_language" as any)
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        const pref = (data as any)?.preferred_language;
        if (pref && (pref === "es" || pref === "en")) {
          setLangState(pref);
          localStorage.setItem("dots_lang", pref);
        }
      });
  }, [user]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      localStorage.setItem("dots_lang", l);
      if (user) {
        supabase
          .from("profiles")
          .update({ preferred_language: l } as any)
          .eq("id", user.id)
          .then(() => {});
      }
    },
    [user]
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = translations[lang]?.[key] || translations.es[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
