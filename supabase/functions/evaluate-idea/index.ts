import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { betaJSONSchemaOutputFormat } from "npm:@anthropic-ai/sdk@0.131.0/helpers/beta/json-schema";
import { corsHeaders, json, userError } from "../_shared/http.ts";
import { aiErrorResponse, claude, DATA_RULE, MODEL, REFUSAL_FALLBACK, tagged } from "../_shared/claude.ts";

// Open to visitors without an account, so input size is capped to bound the cost of each call.
const MAX_WORD = 80;
const MAX_IDEA = 1500;

const EVALUATION = betaJSONSchemaOutputFormat({
  type: "object",
  properties: {
    originality: { type: "integer", description: "Originalidad, del 1 al 10" },
    insight: { type: "integer", description: "Conexión conceptual, del 1 al 10" },
    campaignPotential: { type: "integer", description: "Potencial creativo, del 1 al 10" },
    explanation: { type: "string", description: "Explicación constructiva y motivadora de la evaluación, 2-3 frases" },
    suggestion: { type: "string", description: "Una sugerencia concreta de mejora creativa, 1-2 frases" },
  },
  required: ["originality", "insight", "campaignPotential", "explanation", "suggestion"],
  additionalProperties: false,
});

const SYSTEM = `Eres un director creativo comprensivo que evalúa ideas que conectan una MARCA con un CONCEPTO. Eres constructivo, perspicaz y motivador.
${DATA_RULE}
Responde siempre en español de España.`;

const score = (n: number) => Math.min(10, Math.max(1, Math.round(n)));

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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
      output_config: { effort: "low", format: EVALUATION },
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Evalúa esta idea creativa.

${tagged("marca", dotA)}
${tagged("concepto", dotB)}
${tagged("idea", idea)}

Puntúa la idea del 1 al 10 en tres criterios:
- Originalidad: lo inesperada o novedosa que es.
- Conexión conceptual: lo bien que conecta la marca con el concepto de forma significativa.
- Potencial creativo: lo fuerte que podría ser como campaña, producto, historia o concepto creativo.

Añade una explicación breve (2-3 frases, constructiva y motivadora) y una sugerencia concreta de mejora (1-2 frases).`,
      }],
    });

    if (response.stop_reason === "refusal") return userError("La IA no ha podido evaluar esta idea. Prueba a reformularla.");
    const evaluation = response.parsed_output;
    if (!evaluation) throw new Error(`La IA no devolvió la evaluación (stop_reason: ${response.stop_reason})`);

    return json({
      originality: score(evaluation.originality),
      insight: score(evaluation.insight),
      campaignPotential: score(evaluation.campaignPotential),
      explanation: evaluation.explanation,
      suggestion: evaluation.suggestion,
    });
  } catch (e) {
    return aiErrorResponse(e);
  }
});
