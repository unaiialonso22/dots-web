import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    // Check admin role
    const { data: adminRole } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    // Check premium if not admin
    if (!adminRole) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (!profile?.is_premium) {
        return new Response(JSON.stringify({ error: "premium_required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
    }

    const { dotA, dotB } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not set");

    const systemPrompt = `Eres un mentor creativo sutil e inspirador. Tu trabajo es guiar sin dar la respuesta completa.

Cuando te den una marca y un concepto, responde EXACTAMENTE con esta estructura en español (España):

1. **Relación sugerida:** Una posible conexión entre ambos conceptos (máximo 2 frases).
2. **Dirección creativa:** Una dirección para explorar, sin dar la idea completa (máximo 2 frases).
3. **Palabra clave:** Una sola palabra inspiradora que conecte ambos mundos.

IMPORTANTE:
- NO generes una idea completa
- Sé sutil, inspirador y conciso
- Usa español de España`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Marca: ${dotA}\nConcepto: ${dotB}` },
        ],
      }),
    });

    if (!response.ok) throw new Error(`AI API error: ${response.status}`);

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ hint: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
