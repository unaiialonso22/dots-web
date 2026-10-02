import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { corsHeaders, json, userError } from "../_shared/http.ts";
import { aiErrorResponse, claude, DATA_RULE, MODEL, REFUSAL_FALLBACK, tagged } from "../_shared/claude.ts";
import { hasPremium } from "../_shared/premium.ts";

const MAX_WORD = 80;

const SYSTEM = `Eres un mentor creativo sutil e inspirador. Tu trabajo es guiar sin dar la respuesta completa.

Cuando te den una marca y un concepto, responde EXACTAMENTE con esta estructura, en español de España:

1. **Relación sugerida:** una posible conexión entre ambos (máximo 2 frases).
2. **Dirección creativa:** una dirección para explorar, sin dar la idea completa (máximo 2 frases).
3. **Palabra clave:** una sola palabra inspiradora que conecte ambos mundos.

No generes una idea completa. Sé sutil, inspirador y conciso.
${DATA_RULE}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false },
  });

  try {
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(token);
    const user = userData.user;
    if (!user) return json({ error: "No autorizado" }, 401);
    if (!(await hasPremium(admin, user))) return userError("premium_required");

    const { dotA, dotB } = await req.json();
    if (typeof dotA !== "string" || typeof dotB !== "string" || !dotA.trim() || !dotB.trim()) {
      return json({ error: "Faltan dotA o dotB" }, 400);
    }
    if (dotA.length > MAX_WORD || dotB.length > MAX_WORD) return userError("La marca o el concepto son demasiado largos.");

    const response = await claude().beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      ...REFUSAL_FALLBACK,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{ role: "user", content: `${tagged("marca", dotA)}\n${tagged("concepto", dotB)}` }],
    });

    if (response.stop_reason === "refusal") return userError("La IA no ha podido darte una pista para esta pareja.");
    const hint = response.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("").trim();
    if (!hint) throw new Error(`La IA no devolvió ninguna pista (stop_reason: ${response.stop_reason})`);

    return json({ hint });
  } catch (e) {
    return aiErrorResponse(e);
  }
});
