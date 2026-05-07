import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb, Brain, Check, Crown, Settings, Dumbbell } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FEATURES = [
  {
    icon: Brain,
    title: "Modo Experto Creativo IA",
    description: "Un director creativo, estratega de marca y copywriter analiza y mejora tu idea.",
  },
  {
    icon: Dumbbell,
    title: "Modo entrenamiento ilimitado",
    description: "Practica con retos ilimitados y perfecciona tu creatividad sin límites.",
  },
  {
    icon: Lightbulb,
    title: "Mini-ayuda creativa",
    description: "¿Bloqueado? Obtén pistas sutiles que te guían sin darte la respuesta.",
  },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, checkSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const [checkingOut, setCheckingOut] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("¡Ahora eres usuario Premium!");
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "Error al iniciar el pago.");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleManage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error("Error al abrir la gestión de suscripción.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNav />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-premium/10 rounded-full px-4 py-1.5 mb-4">
            <Crown className="w-4 h-4 text-premium" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-premium">Premium</span>
          </div>
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="DOTS"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Desbloquea tu creatividad
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Lleva tus ideas al siguiente nivel con herramientas profesionales de creatividad asistida por IA.
          </p>
        </motion.div>

        <div className="space-y-4 mb-10">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-premium/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-premium" />
              </div>
              <div>
                <p className="font-heading font-semibold mb-1">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-premium/30 bg-card p-8 text-center"
        >
          {isPremium ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-premium">
                <Check className="w-5 h-5" />
                <span className="font-heading font-bold">Eres usuario Premium</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Disfruta de todas las funciones exclusivas.
              </p>
              <Button variant="outline" onClick={handleManage} className="gap-2">
                <Settings className="w-4 h-4" />
                Gestionar suscripción
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-heading font-bold mb-1">6,99€</p>
                <p className="text-sm text-muted-foreground">al mes</p>
              </div>
              <ul className="text-sm text-left max-w-xs mx-auto space-y-2">
                {["Modo Experto Creativo IA", "Modo entrenamiento ilimitado", "Mini-ayuda creativa", "Exportar portfolio"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-score-high shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full max-w-xs gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {checkingOut ? "Redirigiendo..." : "Hazte Premium"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Pago seguro con Stripe · Cancela cuando quieras
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
