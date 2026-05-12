import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function BlogBloqueoCreativo() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Bloqueo creativo: qué es y cómo superarlo | DOTS</title>
        <meta name="description" content="El bloqueo creativo es la incapacidad temporal de generar ideas nuevas. Descubre por qué ocurre y 5 técnicas probadas para superarlo, incluyendo el pensamiento lateral." />
        <link rel="canonical" href="https://www.connectdots.es/blog/bloqueo-creativo" />
        <meta property="og:title" content="Bloqueo creativo: qué es y cómo superarlo" />
        <meta property="og:description" content="El bloqueo creativo es la incapacidad temporal de generar ideas nuevas. Descubre por qué ocurre y 5 técnicas probadas para superarlo." />
        <meta property="og:url" content="https://www.connectdots.es/blog/bloqueo-creativo" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="DOTS" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Bloqueo creativo: qué es y cómo superarlo",
          "description": "El bloqueo creativo es la incapacidad temporal de generar ideas nuevas. Descubre por qué ocurre y 5 técnicas probadas para superarlo.",
          "url": "https://www.connectdots.es/blog/bloqueo-creativo",
          "datePublished": "2026-05-11",
          "dateModified": "2026-05-11",
          "author": { "@type": "Organization", "name": "DOTS", "url": "https://www.connectdots.es/" },
          "publisher": { "@type": "Organization", "name": "DOTS", "url": "https://www.connectdots.es/" },
          "inLanguage": "es"
        })}</script>
      </Helmet>
      <div className="min-h-screen bg-[#000A44] text-white px-6 py-12 max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="text-white/50 text-sm mb-12 block hover:text-white bg-transparent border-none cursor-pointer">
          Volver al inicio
        </button>
        <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Creatividad</p>
        <h1 className="text-3xl font-bold mb-4 leading-tight">Bloqueo creativo: qué es y cómo superarlo</h1>
        <p className="text-white/40 text-sm mb-10">Por DOTS · Mayo 2026 · 6 min</p>
        <p className="text-white/70 text-lg leading-relaxed mb-8">¿Alguna vez te quedaste sin ideas justo cuando más las necesitabas? Eso se llama bloqueo creativo. Y tiene solución.</p>
        <h2 className="text-xl font-bold mb-3 mt-8">¿Qué es el bloqueo creativo?</h2>
        <p className="text-white/70 leading-relaxed mb-5">El bloqueo creativo es la incapacidad temporal de generar ideas nuevas. No significa que hayas perdido tu creatividad, sino que tu mente está atascada en los mismos patrones de pensamiento.</p>
        <h2 className="text-xl font-bold mb-3 mt-8">¿Por qué ocurre?</h2>
        <ul className="list-disc pl-5 text-white/70 space-y-2 mb-5">
          <li>Perfeccionismo: el miedo a fallar te paraliza antes de empezar.</li>
          <li>Falta de estímulos: si consumes siempre lo mismo, produces lo mismo.</li>
          <li>Estrés: el cortisol inhibe el pensamiento creativo.</li>
          <li>Distracción: el modo multitarea impide el estado de flujo.</li>
          <li>Fatiga mental: forzar la creatividad sin descanso es contraproducente.</li>
        </ul>
        <h2 className="text-xl font-bold mb-3 mt-8">¿Cómo superarlo?</h2>
        <h3 className="text-lg font-semibold mb-2 mt-6">1. Conectar conceptos aleatorios</h3>
        <p className="text-white/70 leading-relaxed mb-3">Forzar al cerebro a conectar dos ideas sin relación activa el pensamiento lateral. Es lo que hace DOTS.</p>
        <h3 className="text-lg font-semibold mb-2 mt-6">2. Freewriting</h3>
        <p className="text-white/70 leading-relaxed mb-3">Pon un temporizador de 10 minutos y escribe sin parar ni corregir.</p>
        <h3 className="text-lg font-semibold mb-2 mt-6">3. Cambiar de entorno</h3>
        <p className="text-white/70 leading-relaxed mb-3">El cerebro asocia lugares con estados mentales. Cambiar de lugar puede desbloquear nuevas ideas.</p>
        <h3 className="text-lg font-semibold mb-2 mt-6">4. La técnica SCAMPER</h3>
        <ul className="list-disc pl-5 text-white/70 space-y-1 mb-5">
          <li>Sustituir, Combinar, Adaptar, Modificar, Eliminar, Reorganizar.</li>
        </ul>
        <h3 className="text-lg font-semibold mb-2 mt-6">5. Descanso productivo</h3>
        <p className="text-white/70 leading-relaxed mb-10">Durante la ducha o un paseo, el cerebro activa el modo por defecto.</p>
        <div className="bg-white text-[#000A44] rounded-xl p-8 text-center mt-8">
          <h3 className="text-xl font-bold mb-2">Entrena tu creatividad ahora</h3>
          <p className="mb-5 opacity-70">DOTS conecta dos conceptos aleatorios. Gratis y sin registro.</p>
          <button onClick={() => navigate("/")} className="bg-[#000A44] text-white px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer border-none">Probar DOTS gratis</button>
        </div>
      </div>
    </>
  );
}
