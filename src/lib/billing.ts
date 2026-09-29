import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function openCustomerPortal(errorMessage: string) {
  try {
    const { data, error } = await supabase.functions.invoke("customer-portal");
    if (error) throw error;
    // Same-tab navigation: a window.open after an await is swallowed by Safari's popup blocker.
    if (data?.url) window.location.href = data.url;
  } catch (e) {
    console.error("Customer portal error:", e);
    toast.error(errorMessage);
  }
}
