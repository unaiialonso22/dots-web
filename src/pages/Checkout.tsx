import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Brain, Check, Crown, Dumbbell, Lightbulb, Loader2, Lock, Sparkles } from "lucide-react";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { openCustomerPortal } from "@/lib/billing";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const FEATURES = [
  { icon: Brain, key: "checkout_feature_expert" },
  { icon: Dumbbell, key: "checkout_feature_training" },
  { icon: Lightbulb, key: "checkout_feature_hint" },
  { icon: Sparkles, key: "checkout_feature_improve" },
];

type Status = "loading" | "ready" | "error" | "subscribed";

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading, checkSubscription } = useSubscription();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { state: { returnTo: "/pago" } });
  }, [authLoading, user, navigate]);

  const prepare = useCallback(async () => {
    setStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.alreadySubscribed) {
        await checkSubscription();
        setStatus("subscribed");
        return;
      }
      if (!data?.clientSecret) throw new Error("create-checkout returned no client secret");
      setClientSecret(data.clientSecret);
      setStatus("ready");
    } catch (e) {
      console.error("Checkout error:", e);
      setStatus("error");
    }
  }, [checkSubscription]);

  const requested = useRef(false);
  useEffect(() => {
    if (!user || subLoading || !stripePromise) return;
    if (isPremium) {
      setStatus("subscribed");
      return;
    }
    if (requested.current) return;
    requested.current = true;
    prepare();
  }, [user, subLoading, isPremium, prepare]);

  let panel: JSX.Element;
  if (!stripePromise) {
    panel = <Notice text={t("checkout_unavailable")} />;
  } else if (status === "subscribed") {
    panel = (
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-premium/10 flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-premium" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">{t("checkout_already_title")}</h2>
        <p className="text-muted-foreground mb-7">{t("checkout_already_desc")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => navigate("/training")}>{t("checkout_go_train")}</Button>
          <Button variant="outline" onClick={() => openCustomerPortal(t("checkout_portal_error"))}>
            {t("checkout_manage")}
          </Button>
        </div>
      </div>
    );
  } else if (status === "error") {
    panel = (
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
        <p className="font-heading font-semibold mb-5">{t("checkout_error")}</p>
        <Button variant="outline" onClick={prepare}>{t("checkout_retry")}</Button>
      </div>
    );
  } else if (status === "ready" && clientSecret) {
    panel = (
      // Stripe renders its form on a light surface in both themes, so the frame stays light too.
      <div className="rounded-2xl bg-white p-2 sm:p-4 ring-1 ring-border shadow-sm overflow-hidden">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  } else {
    panel = (
      <div className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center justify-center gap-4 min-h-[420px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("checkout_loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{t("checkout_meta_title")}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AppNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 items-start">
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center gap-2 bg-premium/10 rounded-full px-4 py-1.5 mb-5">
              <Crown className="w-4 h-4 text-premium" />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-premium">
                {t("checkout_kicker")}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">{t("checkout_title")}</h1>
            <p className="text-muted-foreground mb-8 max-w-md">{t("checkout_subtitle")}</p>

            <div className="rounded-2xl border-2 border-premium/30 bg-card p-6 mb-7">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-heading font-bold">{t("checkout_price")}</span>
                <span className="text-muted-foreground">{t("checkout_per_month")}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{t("checkout_no_commitment")}</p>
              <ul className="space-y-3">
                {FEATURES.map(({ icon: Icon, key }) => (
                  <li key={key} className="flex items-center gap-3 text-sm">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-premium/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-premium" />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {t("checkout_methods")}
            </p>
            <ul className="flex flex-wrap gap-2 mb-7">
              {["Apple Pay", "Google Pay", t("checkout_method_card")].map((method) => (
                <li key={method} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                  {method}
                </li>
              ))}
            </ul>

            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {t("checkout_secure")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{t("checkout_seller")}</p>
            <p className="text-xs text-muted-foreground mt-2">{t("checkout_cancel_hint")}</p>
          </motion.aside>

          <section aria-live="polite">{panel}</section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
