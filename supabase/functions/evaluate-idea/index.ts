import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dotA, dotB, idea } = await req.json();

    if (!dotA || !dotB || !idea) {
      return new Response(
        JSON.stringify({ error: "Faltan dotA, dotB o idea" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un director creativo comprensivo que evalúa ideas que conectan una MARCA con un CONCEPTO.
Eres constructivo, perspicaz y motivador. Debes responder ÚNICAMENTE llamando a la función evaluate_idea. Nunca respondas con texto plano.
IMPORTANTE: Toda tu respuesta debe estar en español de España.`;

    const userPrompt = `Evalúa esta idea creativa:

MARCA: "${dotA}"
CONCEPTO: "${dotB}"

IDEA: "${idea}"

Puntúa la idea en tres criterios (1-10 cada uno):
- Originalidad: Lo inesperada o novedosa que es la idea
- Conexión conceptual: Lo bien que la marca y el concepto están conectados de forma significativa
- Potencial creativo: Lo fuerte que podría ser la idea como campaña, producto, historia o concepto creativo

También proporciona:
1. Una breve explicación de la evaluación (2-3 frases, constructiva y motivadora, en español de España)
2. Una sugerencia concreta de mejora creativa (1-2 frases, en español de España)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_idea",
              description: "Devuelve las puntuaciones y feedback de una idea creativa.",
              parameters: {
                type: "object",
                properties: {
                  originality: { type: "number", description: "Puntuación de originalidad 1-10" },
                  insight: { type: "number", description: "Puntuación de conexión conceptual 1-10" },
                  campaignPotential: { type: "number", description: "Puntuación de potencial creativo 1-10" },
                  explanation: { type: "string", description: "Breve explicación constructiva de la evaluación (2-3 frases en español de España)" },
                  suggestion: { type: "string", description: "Una sugerencia concreta de mejora creativa (1-2 frases en español de España)" },
                },
                required: ["originality", "insight", "campaignPotential", "explanation", "suggestion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "evaluate_idea" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado. Inténtalo de nuevo en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Límite de uso de IA alcanzado. Añade créditos para continuar." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No se recibió evaluación de la IA");
    }

    const evaluation = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-idea error:", e);
    const message = e instanceof Error ? e.message : "Error desconocido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
