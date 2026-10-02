import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

// Target of the links in our email templates: the link points at connectdots.es instead of supabase.co,
// and the session is created right here, in the app.
export default function AuthConfirm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;
    const next = params.get("next");
    const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/challenge";
    if (!tokenHash || !type) {
      setFailed(true);
      return;
    }
    supabase.auth.verifyOtp({ token_hash: tokenHash, type }).then(({ error }) => {
      if (error) setFailed(true);
      else navigate(target, { replace: true });
    });
  }, [params, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Helmet>
        <title>{t("confirm_meta_title")}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {failed ? (
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-heading font-bold">{t("confirm_failed_title")}</h1>
          <p className="text-muted-foreground">{t("confirm_failed_desc")}</p>
          <Button onClick={() => navigate("/auth")}>{t("confirm_go_login")}</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t("confirm_checking")}</p>
        </div>
      )}
    </div>
  );
}
