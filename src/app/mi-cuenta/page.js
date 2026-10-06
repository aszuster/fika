import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AccountTabs from "@/components/account/AccountTabs";

export default async function MiCuentaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/ingresar");
  }

  const [
    { data: profile },
    { data: favorites },
    { data: projects },
    { data: quoteRequests },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("*, project_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("quote_requests")
      .select("*, quote_request_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AccountTabs
      profile={profile}
      favorites={favorites ?? []}
      projects={projects ?? []}
      quoteRequests={quoteRequests ?? []}
    />
  );
}
