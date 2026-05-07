import { useState } from "react";
import { Sparkles } from "lucide-react";

const concepts = [
  "Café", "Bicicleta", "Museo", "Tecnología", "Sostenibilidad",
  "Música", "Educación", "Viajes", "Salud", "Diseño",
  "Arquitectura", "Gastronomía", "Naturaleza", "Energía", "Comunidad",
  "Cine", "Literatura", "Deporte", "Arte", "Innovación",
  "Meditación", "Networking", "Marketing", "Psicología", "Sostenibilidad",
];

export default function Landing() {
  const [concept1, setConcept1] = useState<string>("");
  const [concept2, setConcept2] = useState<string>("");
  const [idea, setIdea] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ideaCount, setIdeaCount] = useState(0);

  const getRandomConcept = () => {
    return concepts[Math.floor(Math.random() * concepts.length)];
  };

  const generateIdea = async () => {
    setLoading(true);
    const c1 = getRandomConcept();
    const c2 = getRandomConcept();
    
    setConcept1(c1);
    setConcept2(c2);
    
    // Simular delay para que se vea natural
    setTimeout(() => {
      const ideas = [
        `Un servicio de suscripción que combina ${c1} con ${c2} de manera innovadora.`,
        `Una aplicación que conecta amantes de ${c1} con expertos en ${c2}.`,
        `Un evento híbrido que fusiona la experiencia de ${c1} con conceptos de ${c2}.`,
        `Una plataforma educativa que enseña ${c1} a través de ${c2}.`,
        `Un producto que optimiza ${c1} utilizando principios de ${c2}.`,
        `Un modelo de negocio que explota la intersección entre ${c1} y ${c2}.`,
        `Una comunidad enfocada en resolver problemas de ${c1} con ideas de ${c2}.`,
        `Un taller creativo que combina ${c1} con técnicas de ${c2}.`,
      ];
      
      setIdea(ideas[Math.floor(Math.random() * ideas.length)]);
      setIdeaCount(ideaCount + 1);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div className="text-2xl font-bold">DOTS</div>
        <p className="text-sm text-slate-400">El gimnasio para el pensamiento creativo</p>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              Te damos dos palabras
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Tú haces magia
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg mx-auto">
              Conecta conceptos aleatorios y dispara tu creatividad. Supera el bloqueo creativo en 10 segundos.
            </p>
          </div>

          {/* Generator */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-6">
            {/* Concepts Display */}
            {concept1 && concept2 && (
              <div className="flex items-center justify-center gap-4">
                <div className="px-6 py-3 bg-blue-900/50 border border-blue-500 rounded-lg">
                  <p className="font-semibold text-lg">{concept1}</p>
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <div className="px-6 py-3 bg-cyan-900/50 border border-cyan-500 rounded-lg">
                  <p className="font-semibold text-lg">{concept2}</p>
                </div>
              </div>
            )}

            {/* Idea Display */}
            {idea && (
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-6 text-left">
                <p className="text-lg leading-relaxed">{idea}</p>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={generateIdea}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 rounded-lg font-semibold text-lg transition-all"
            >
              {loading ? "Conectando conceptos..." : "Dame mis dos palabras →"}
            </button>

            {/* Stats */}
            {ideaCount > 0 && (
              <p className="text-sm text-slate-400 text-center">
                {ideaCount} idea{ideaCount !== 1 ? "s" : ""} generada{ideaCount !== 1 ? "s" : ""} hoy
              </p>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm text-slate-400">
            <p>✓ Gratis • ✓ Sin registro • ✓ Sin límites</p>
            <p>Conecta lo imposible. Crea lo inesperado.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-6 text-center text-slate-500 text-sm">
        <p>DOTS © 2026 — El gimnasio para el pensamiento creativo</p>
      </footer>
    </div>
  );
}
