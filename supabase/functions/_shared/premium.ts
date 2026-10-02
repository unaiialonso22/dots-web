import Stripe from "https://esm.sh/stripe@18.5.0";
import type { SupabaseClient, User } from "npm:@supabase/supabase-js@2.57.2";

const PREMIUM_PRODUCT_ID = "prod_VLjowKnP8SaLxF";

// Checked against Stripe on every call: profiles.is_premium is writable by its own user, so it can't gate paid features.
export async function hasPremium(admin: SupabaseClient, user: User): Promise<boolean> {
  const { data: adminRole } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (adminRole) return true;
  if (!user.email) return false;

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2025-08-27.basil" });
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customerId = customers.data[0]?.id;
  if (!customerId) return false;
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 10 });
  return subscriptions.data.some((s) => s.items.data.some((item) => item.price.product === PREMIUM_PRODUCT_ID));
}
