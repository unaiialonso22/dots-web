import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: adminRole } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    // Check premium status if not admin
    if (!adminRole) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (!profile?.is_premium) {
        return new Response(
          JSON.stringify({ error: "premium_required", message: "Esta función forma parte del plan Premium." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { dotA, dotB, idea } = await req.json();

    if (!dotA || !dotB || !idea) {
      return new Response(
        JSON.stringify({ error: "Faltan dotA, dotB o idea" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Eres un experto creativo de primer nivel que combina los roles de Director Creativo, Estratega de Marca y Copywriter.
Tu tarea es analizar una idea creativa que conecta una MARCA con un CONCEPTO y proporcionar un análisis profesional completo.
Debes responder ÚNICAMENTE llamando a la función expert_analysis. Nunca respondas con texto plano.
IMPORTANTE: Toda tu respuesta debe estar en español de España.
Tu tono debe ser perspicaz, incisivo, inspirador y claro. Evita respuestas genéricas. Sé específico y profesional.`;

    const userPrompt = `Analiza esta idea creativa como un equipo de expertos creativos:

MARCA: "${dotA}"
CONCEPTO: "${dotB}"

IDEA DEL USUARIO: "${idea}"

Proporciona un análisis experto completo siguiendo esta estructura:

1. ANÁLISIS CREATIVO: Evaluación breve de qué funciona y qué no en la idea (2-3 frases).

2. MEJORA DE LA IDEA: Reescribe la idea haciéndola más original, más impactante y más coherente.

3. INSIGHT CREATIVO: Identifica un insight humano o cultural profundo detrás de la idea.

4. CONCEPTO CREATIVO: Resume la idea en un concepto creativo potente de una sola frase.

5. EJECUCIÓN PUBLICITARIA: Sugiere cómo se podría ejecutar la idea (campaña, contenido en redes sociales, anuncio, idea de producto, etc.) con un ejemplo concreto.

6. COPY PUBLICITARIO: Genera un tagline y un mensaje corto de campaña.`;

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
              name: "expert_analysis",
              description: "Devuelve el análisis experto completo de una idea creativa.",
              parameters: {
                type: "object",
                properties: {
                  creative_analysis: { type: "string", description: "Análisis creativo: qué funciona y qué no (2-3 frases)" },
                  improved_idea: { type: "string", description: "La idea reescrita de forma más original, impactante y coherente" },
                  creative_insight: { type: "string", description: "Insight humano o cultural profundo detrás de la idea" },
                  creative_concept: { type: "string", description: "Concepto creativo potente resumido en una frase" },
                  execution: { type: "string", description: "Sugerencia concreta de ejecución publicitaria" },
                  tagline: { type: "string", description: "Un tagline publicitario" },
                  campaign_message: { type: "string", description: "Un mensaje corto de campaña" },
                },
                required: ["creative_analysis", "improved_idea", "creative_insight", "creative_concept", "execution", "tagline", "campaign_message"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "expert_analysis" } },
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
      throw new Error("No se recibió análisis de la IA");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("expert-analysis error:", e);
    const message = e instanceof Error ? e.message : "Error desconocido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
