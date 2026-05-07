import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Moon, Sun, Dices, Brain, Share2, ArrowRight, Crown, Globe,
  Sparkles, Zap, RefreshCw, Star, Flame, Target, Trophy
} from "lucide-react";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import iconDark from "@/assets/icon-dark.svg";
import iconLight from "@/assets/icon-light.svg";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

// Demo combinations for hero rotation
const demoCombos = [
  { a: "Bicicleta", b: "Soledad", idea: "Servicio de alquiler de bicicletas para personas mayores que viven solas, con app de acompañamiento virtual." },
  { a: "Café", b: "Astronomía", idea: "Cafetería nocturna con techo retráctil donde cada mesa incluye un mini telescopio y un mapa estelar del día." },
  { a: "Lluvia", b: "Música", idea: "App que transforma el sonido de la lluvia local en tiempo real en una pieza musical ambiental única." },
];

const examples = [
  { a: "Pizza", b: "Arquitectura", idea: "Restaurante modular de pizza donde cada mesa es un 'plano de planta' diferente y los ingredientes son los materiales de construcción." },
  { a: "Meditación", b: "Videojuego", idea: "App de meditación gamificada donde las rarezas y niveles se desbloquean según tu consistencia diaria, no según cuánto pagues." },
  { a: "Biblioteca", b: "Tinder", idea: "Plataforma de préstamo de libros entre vecinos con sistema de match por intereses literarios." },
];

const levels = [
  { name: "Novato Creativo", range: "0–10 ideas" },
  { name: "Pensador Lateral", range: "11–50 ideas" },
  { name: "Conector de Mundos", range: "51–200 ideas" },
  { name: "Visionario", range: "200+ ideas" },
];

const badges = [
  { icon: Flame, label: "7 días seguidos" },
  { icon: Zap, label: "Primera idea compartida" },
  { icon: Target, label: "10 combinaciones en un día" },
  { icon: Trophy, label: "Idea con más de 100 votos" },
];

const testimonials = [
  { initials: "MG", name: "Marta G., diseñadora UX", text: "Llevo 3 semanas con DOTS cada mañana antes de trabajar. Mi proceso creativo ha cambiado por completo. Ya no me bloqueo." },
  { initials: "CR", name: "Carlos R., emprendedor", text: "Usé una combinación de DOTS para el nombre de mi último proyecto. Lo que parecía una tontería se convirtió en la idea más valorada de mi pitch." },
  { initials: "LT", name: "Lucía T., estudiante de publicidad", text: "Mi profesora me preguntó de dónde había sacado la idea del trabajo final. Le dije que de un gimnasio. Me miró raro. DOTS es mi secreto." },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  const [comboIdx, setComboIdx] = useState(0);
  const combo = demoCombos[comboIdx];
  const cycleCombo = () => setComboIdx((i) => (i + 1) % demoCombos.length);

  const goHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* HEADER / NAV */}
      <header>
        <nav
          className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full"
          aria-label="Navegación principal"
        >
          <button onClick={() => navigate("/")} className="focus:outline-none" aria-label="Ir al inicio DOTS">
            <img
              src={theme === "dark" ? iconLight : iconDark}
              alt="DOTS — Generador de ideas creativas con IA"
              className="h-9 w-auto"
              loading="eager"
            />
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              title={lang === "es" ? "English" : "Español"}
              aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/feed")} className="hidden sm:inline-flex">
              Comunidad
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/challenge")} className="hidden sm:inline-flex">
                  Reto
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/portfolio")} className="hidden sm:inline-flex">
                  Portfolio
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Entrar
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section
          className="px-6 pt-12 pb-20 md:pt-20 md:pb-28"
          aria-label="Hero — Generador de ideas creativas con IA"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 text-xs font-heading uppercase tracking-widest text-muted-foreground mb-8">
                <Sparkles className="w-3.5 h-3.5 text-dot-b" aria-hidden="true" />
                El gimnasio para tu mente creativa
              </span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <img
                src={theme === "dark" ? logoLight : logoDark}
                alt="Logo DOTS"
                className="h-12 md:h-16 w-auto mx-auto mb-8"
                loading="eager"
              />
            </motion.div>

            <motion.h1
              className="font-heading font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              Te damos dos palabras.<br />
              <span className="text-muted-foreground">Tú haces la magia.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-4 leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
            >
              DOTS conecta dos conceptos aleatorios y te reta a generar una idea.
              Entrena el pensamiento lateral. Supera el bloqueo creativo. Empieza ahora.
            </motion.p>

            <motion.p
              className="text-sm text-muted-foreground/80 font-body mb-10"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
            >
              <Sparkles className="inline w-3.5 h-3.5 mr-1.5 text-dot-b" aria-hidden="true" />
              Más de 8.400 ideas generadas esta semana
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={5}
            >
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/challenge")}
                className="text-base px-8 py-6 gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                Dame mis dos palabras <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={goHowItWorks}
                className="text-base"
              >
                ¿Cómo funciona? Míralo aquí
              </Button>
            </motion.div>

            {/* DEMO VISUAL */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={6}
              className="max-w-2xl mx-auto"
            >
              <article
                className="rounded-3xl border-2 border-border bg-card p-6 md:p-8 shadow-sm"
                aria-label="Ejemplo de combinación creativa"
              >
                <div className="flex items-center justify-center gap-3 md:gap-5 mb-6 flex-wrap">
                  <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-sm md:text-base">
                    {combo.a}
                  </span>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-dot-a animate-pulse" />
                    <span className="w-8 h-px bg-border" />
                    <Zap className="w-4 h-4 text-dot-b" />
                    <span className="w-8 h-px bg-border" />
                    <span className="w-1.5 h-1.5 rounded-full bg-dot-b animate-pulse" />
                  </span>
                  <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-sm md:text-base">
                    {combo.b}
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-body italic leading-relaxed mb-5">
                  "{combo.idea}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleCombo}
                  className="gap-2"
                  aria-label="Generar nueva combinación de ejemplo"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Generar nueva combinación
                </Button>
              </article>
            </motion.div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section
          id="como-funciona"
          className="px-6 py-20 md:py-28 border-t border-border"
          aria-label="Cómo funciona DOTS"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Cómo funciona
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">Así de simple</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Dices, title: "Recibe tus dos palabras", desc: "DOTS te lanza dos conceptos al azar. Pueden parecer incompatibles. Eso es exactamente lo que queremos." },
                { icon: Brain, title: "Conéctalos", desc: "Tu cerebro entra en modo creativo. La IA te ayuda si te quedas bloqueado. No hay respuestas incorrectas." },
                { icon: Share2, title: "Guarda y comparte tu idea", desc: "Guarda las ideas que te gusten, compártelas en redes y demuestra de qué estás hecho." },
              ].map((step, i) => (
                <motion.article
                  key={step.title}
                  className="text-center md:text-left"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto md:mx-0" aria-hidden="true">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="block text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Paso {i + 1}
                  </span>
                  <h3 className="text-lg font-heading font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* EJEMPLOS REALES */}
        <section className="px-6 py-20 md:py-28 bg-card/50" aria-label="Ejemplos reales de ideas">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Ejemplos
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold max-w-3xl mx-auto">
                Mira lo que sale cuando conectas lo imposible
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {examples.map((ex, i) => (
                <motion.article
                  key={ex.a + ex.b}
                  className="rounded-2xl border-2 border-border bg-card p-6 hover:border-primary/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-heading font-semibold">
                      {ex.a}
                    </span>
                    <Zap className="w-3.5 h-3.5 text-dot-b" aria-hidden="true" />
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-heading font-semibold">
                      {ex.b}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-body leading-relaxed">→ {ex.idea}</p>
                </motion.article>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground font-body mt-10">
              Estas ideas las generaron usuarios reales en menos de 5 minutos.
            </p>
          </div>
        </section>

        {/* GAMIFICACIÓN / NIVELES */}
        <section className="px-6 py-20 md:py-28 border-t border-border" aria-label="Sistema de niveles y logros">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Progresión
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Tu creatividad tiene nivel</h2>
              <p className="text-muted-foreground font-body max-w-xl mx-auto">
                Cada combinación que generas te acerca al siguiente nivel. ¿Cuánto aguanta tu racha?
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {levels.map((lvl, i) => (
                <motion.article
                  key={lvl.name}
                  className="rounded-2xl border-2 border-border bg-card p-5 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-1 mb-3" aria-hidden="true">
                    {Array.from({ length: i + 1 }).map((_, j) => (
                      <span key={j} className="w-2 h-2 rounded-full bg-dot-a" />
                    ))}
                  </div>
                  <h3 className="text-sm font-heading font-bold mb-1">{lvl.name}</h3>
                  <p className="text-xs text-muted-foreground font-body">{lvl.range}</p>
                </motion.article>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-body"
                >
                  <b.icon className="w-4 h-4 text-dot-b" aria-hidden="true" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="px-6 py-20 md:py-28 bg-card/50" aria-label="Testimonios de usuarios">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Comunidad
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">Lo que dicen los que ya entrenan</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.article
                  key={t.name}
                  className="rounded-2xl border-2 border-border bg-card p-6 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm"
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <p className="text-sm font-heading font-semibold">{t.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-premium text-premium" aria-hidden="true" />
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* RETO DEL DÍA */}
        <section className="px-6 py-20 md:py-28 border-t border-border" aria-label="Reto creativo del día">
          <div className="max-w-3xl mx-auto">
            <motion.article
              className="rounded-3xl border-2 border-dot-b/40 bg-card p-8 md:p-12 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-heading font-bold uppercase tracking-widest text-dot-b mb-3">
                Reto de hoy
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Acepta el reto diario</h2>
              <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">
                Cada día una combinación nueva para toda la comunidad. ¿Cuál es tu idea?
              </p>

              <div className="flex items-center justify-center gap-3 md:gap-5 mb-8 flex-wrap">
                <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-base md:text-lg">
                  Café
                </span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-dot-a animate-pulse" />
                  <span className="w-8 h-px bg-border" />
                  <Zap className="w-5 h-5 text-dot-b" />
                  <span className="w-8 h-px bg-border" />
                  <span className="w-1.5 h-1.5 rounded-full bg-dot-b animate-pulse" />
                </span>
                <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-base md:text-lg">
                  Cementerio
                </span>
              </div>

              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/challenge")}
                className="text-base px-8 py-6 gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                Aceptar el reto <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground font-body mt-4">
                Comparte tu idea con #ConnectTheDots
              </p>
            </motion.article>
          </div>
        </section>

        {/* PREMIUM */}
        <section className="px-6 py-20 md:py-28 border-t border-border" aria-label="DOTS Premium">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-premium/10 rounded-full px-4 py-1.5 mb-6">
                <Crown className="w-4 h-4 text-premium" aria-hidden="true" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-premium">
                  Premium
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Lleva tu creatividad al siguiente nivel
              </h2>
              <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">
                Acceso al Modo Experto Creativo IA, retos ilimitados y herramientas avanzadas para profesionales.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/premium")}
                className="gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                <Crown className="w-4 h-4" /> Descubre Premium
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-24 md:py-32 bg-primary text-primary-foreground" aria-label="Empezar ahora">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Tu próxima gran idea<br />empieza con dos palabras
              </h2>
              <p className="text-primary-foreground/70 font-body mb-10 text-lg max-w-xl mx-auto">
                Miles de creativos, estudiantes y emprendedores ya entrenan su mente con DOTS.
                Gratis. Sin registro. Sin excusas.
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/challenge")}
                className="text-base px-8 py-6 gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                Empezar ahora, es gratis <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-primary-foreground/60 font-body mt-5">
                Sin tarjeta de crédito · Sin registro obligatorio · Funciona en móvil
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
