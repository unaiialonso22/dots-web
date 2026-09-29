import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/hooks/useLanguage";

// Stripe creates the subscription when Checkout completes; allow a few seconds for it to read as active.
const MAX_CHECKS = 4;
const RETRY_MS = 2500;

export default function CheckoutReturn() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, checkSubscription } = useSubscription();
  const [checks, setChecks] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { state: { returnTo: "/pago/gracias" } });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || isPremium || checks >= MAX_CHECKS) return;
    const id = window.setTimeout(async () => {
      await checkSubscription();
      setChecks((n) => n + 1);
    }, checks === 0 ? 0 : RETRY_MS);
    return () => window.clearTimeout(id);
  }, [user, isPremium, checks, checkSubscription]);

  const confirming = !isPremium && checks < MAX_CHECKS;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{t("checkout_return_meta_title")}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AppNav />

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="rounded-2xl border-2 border-premium/30 bg-card p-8 md:p-10 text-center"
        >
          {isPremium ? (
            <>
              <div className="w-16 h-16 rounded-full bg-premium/10 flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-premium" />
              </div>
              <h1 className="text-3xl font-heading font-bold mb-3">{t("checkout_return_success_title")}</h1>
              <p className="text-muted-foreground mb-8">{t("checkout_return_success_desc")}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => navigate("/training")}>{t("checkout_go_train")}</Button>
                <Button variant="outline" onClick={() => navigate("/improve")}>
                  {t("checkout_return_improve")}
                </Button>
              </div>
            </>
          ) : confirming ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">{t("checkout_return_confirming")}</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-heading font-bold mb-3">{t("checkout_return_pending_title")}</h1>
              <p className="text-muted-foreground mb-7">{t("checkout_return_pending_desc")}</p>
              <Button variant="outline" onClick={() => setChecks(0)}>{t("checkout_return_recheck")}</Button>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
