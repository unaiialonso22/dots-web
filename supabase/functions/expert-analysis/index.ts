import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { betaJSONSchemaOutputFormat } from "npm:@anthropic-ai/sdk@0.131.0/helpers/beta/json-schema";
import { corsHeaders, json, userError } from "../_shared/http.ts";
import { aiErrorResponse, claude, DATA_RULE, MODEL, REFUSAL_FALLBACK, tagged } from "../_shared/claude.ts";
import { hasPremium } from "../_shared/premium.ts";

const MAX_WORD = 80;
const MAX_IDEA = 1500;

const ANALYSIS = betaJSONSchemaOutputFormat({
  type: "object",
  properties: {
    creative_analysis: { type: "string", description: "Qué funciona y qué no en la idea, 2-3 frases" },
    improved_idea: { type: "string", description: "La idea reescrita: más original, impactante y coherente" },
    creative_insight: { type: "string", description: "El insight humano o cultural profundo detrás de la idea" },
    creative_concept: { type: "string", description: "El concepto creativo resumido en una sola frase potente" },
    execution: { type: "string", description: "Cómo ejecutarla (campaña, redes, anuncio, producto…) con un ejemplo concreto" },
    tagline: { type: "string", description: "Un tagline publicitario" },
    campaign_message: { type: "string", description: "Un mensaje corto de campaña" },
  },
  required: ["creative_analysis", "improved_idea", "creative_insight", "creative_concept", "execution", "tagline", "campaign_message"],
  additionalProperties: false,
});

const SYSTEM = `Eres un experto creativo de primer nivel que combina los roles de Director Creativo, Estratega de Marca y Copywriter. Analizas ideas que conectan una MARCA con un CONCEPTO y das un análisis profesional completo.
Tu tono es perspicaz, incisivo, inspirador y claro. Evita las respuestas genéricas: sé específico y profesional.
${DATA_RULE}
Responde siempre en español de España.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(token);
    const user = userData.user;
    if (!user) return json({ error: "No autorizado" }, 401);
    if (!(await hasPremium(admin, user))) return userError("premium_required");

    const { dotA, dotB, idea } = await req.json();
    if (typeof dotA !== "string" || typeof dotB !== "string" || typeof idea !== "string" || !dotA.trim() || !dotB.trim() || !idea.trim()) {
      return json({ error: "Faltan dotA, dotB o idea" }, 400);
    }
    if (dotA.length > MAX_WORD || dotB.length > MAX_WORD) return userError("La marca o el concepto son demasiado largos.");
    if (idea.length > MAX_IDEA) return userError(`La idea es demasiado larga: máximo ${MAX_IDEA} caracteres.`);

    const response = await claude().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      ...REFUSAL_FALLBACK,
      output_config: { effort: "medium", format: ANALYSIS },
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Analiza esta idea creativa como un equipo de expertos.

${tagged("marca", dotA)}
${tagged("concepto", dotB)}
${tagged("idea", idea)}

Devuelve:
1. Análisis creativo: qué funciona y qué no (2-3 frases).
2. Mejora de la idea: reescríbela más original, impactante y coherente.
3. Insight creativo: el insight humano o cultural profundo detrás de la idea.
4. Concepto creativo: la idea en una sola frase potente.
5. Ejecución publicitaria: cómo ejecutarla (campaña, contenido en redes, anuncio, producto…) con un ejemplo concreto.
6. Copy: un tagline y un mensaje corto de campaña.`,
      }],
    });

    if (response.stop_reason === "refusal") return userError("La IA no ha podido analizar esta idea. Prueba a reformularla.");
    const analysis = response.parsed_output;
    if (!analysis) throw new Error(`La IA no devolvió el análisis (stop_reason: ${response.stop_reason})`);

    return json(analysis);
  } catch (e) {
    return aiErrorResponse(e);
  }
});
