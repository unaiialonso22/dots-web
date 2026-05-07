import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";

const concepts = [
  "Café", "Bicicleta", "Museo", "Tecnología", "Sostenibilidad",
  "Música", "Educación", "Viajes", "Salud", "Diseño",
  "Arquitectura", "Gastronomía", "Naturaleza", "Energía", "Comunidad",
  "Cine", "Literatura", "Deporte", "Arte", "Innovación",
  "Meditación", "Psicología", "Moda", "Fotografía", "Robots",
  "Jardinería", "Astronomía", "Cocina", "Teatro", "Danza",
  "Finanzas", "Podcast", "Yoga", "Cerámica", "Surf",
  "Inteligencia Artificial", "Filosofía", "Tatuaje", "Montañismo", "Abejas",
];

const ideaTemplates = [
  (a: string, b: string) => `Una app que conecta a personas apasionadas por ${a} con expertos en ${b} para crear proyectos únicos.`,
  (a: string, b: string) => `Un espacio físico donde la experiencia de ${a} se fusiona con el mundo de ${b} para generar nuevas formas de vivir.`,
  (a: string, b: string) => `Una plataforma de suscripción mensual que entrega kits para explorar ${a} desde la perspectiva de ${b}.`,
  (a: string, b: string) => `Un evento comunitario mensual donde ${a} y ${b} se combinan para resolver problemas cotidianos de forma creativa.`,
  (a: string, b: string) => `Una marca que produce productos de ${a} usando principios de diseño inspirados en ${b}.`,
  (a: string, b: string) => `Un documental interactivo que explora qué pasaría si ${a} adoptara los valores y métodos de ${b}.`,
  (a: string, b: string) => `Un curso online que enseña ${b} a través de las metáforas y experiencias del mundo de ${a}.`,
  (a: string, b: string) => `Un modelo de negocio circular donde ${a} financia proyectos de ${b} en comunidades locales.`,
  (a: string, b: string) => `Una red social nicho para personas que trabajan en la intersección entre ${a} y ${b}.`,
  (a: string, b: string) => `Un servicio de consultoría que ayuda a empresas de ${a} a innovar aplicando técnicas de ${b}.`,
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoDifferentConcepts(): [string, string] {
  const c1 = getRandomItem(concepts);
  let c2 = getRandomItem(concepts);
  while (c2 === c1) c2 = getRandomItem(concepts);
  return [c1, c2];
}

export default function Landing() {
  const [concept1, setConcept1] = useState<string>("");
  const [concept2, setConcept2] = useState<string>("");
  const [idea, setIdea] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const generate = () => {
    setLoading(true);
    const [c1, c2] = getTwoDifferentConcepts();
    setConcept1(c1);
    setConcept2(c2);
    setIdea("");
    setTimeout(() => {
      const template = getRandomItem(ideaTemplates);
      setIdea(template(c1, c2));
      setCount((n) => n + 1);
      setLoading(false);
    }, 700);
  };

  const copyIdea = () => {
    if (!idea) return;
    navigator.clipboard.writeText(`${concept1} + ${concept2}: ${idea}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">DOTS</span>
        <span className="text-sm text-white/40 hidden sm:block">El gimnasio para el pensamiento creativo</span>
        <a
          href="https://connectdots.es"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          connectdots.es
        </a>
      </nav>

      {/* HERO */}
      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-2xl w-full text-center space-y-10">

          {/* HEADLINE */}
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Te damos dos palabras.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Tú haces magia.
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed">
              Conecta conceptos aleatorios, provoca ideas que no buscarías solo
              y entrena tu pensamiento creativo cada día.
            </p>
          </div>

          {/* GENERADOR */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

            {/* Conceptos */}
            {concept1 && concept2 ? (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="px-5 py-3 bg-blue-500/20 border border-blue-400/40 rounded-xl">
                  <p className="font-semibold text-lg text-blue-300">{concept1}</p>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="px-5 py-3 bg-cyan-500/20 border border-cyan-400/40 rounded-xl">
                  <p className="font-semibold text-lg text-cyan-300">{concept2}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-white/30 text-lg">???</p>
                </div>
                <Sparkles className="w-5 h-5 text-white/20 flex-shrink-0" />
                <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-white/30 text-lg">???</p>
                </div>
              </div>
            )}

            {/* Idea generada */}
            {idea && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left relative group">
                <p className="text-base leading-relaxed text-white/80">{idea}</p>
                <button
                  onClick={copyIdea}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10"
                  title="Copiar idea"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            )}

            {/* Botón CTA */}
            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Conectando conceptos...
                </>
              ) : count === 0 ? (
                "Dame mis dos palabras →"
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Generar nueva combinación
                </>
              )}
            </button>

            {count > 0 && (
              <p className="text-sm text-white/30 text-center">
                {count} idea{count !== 1 ? "s" : ""} generada{count !== 1 ? "s" : ""} en esta sesión
              </p>
            )}
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-white/40">
            <div className="space-y-1">
              <p className="text-2xl">🧠</p>
              <p>Pensamiento lateral</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl">⚡</p>
              <p>Resultados en segundos</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl">🎯</p>
              <p>Sin bloqueos creativos</p>
            </div>
          </div>

          <p className="text-sm text-white/25">
            Gratis · Sin registro · Sin límites
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-white/25 text-sm">
        <p>DOTS © 2026 — Conecta lo imposible. Crea lo inesperado.</p>
      </footer>
    </div>
  );
}
