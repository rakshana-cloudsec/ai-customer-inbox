import { supabase } from "@/lib/supabaseClient"

export default async function AdminDashboardPage() {
  const [
    { count: totalConversations },
    { count: openConversations },
    { count: newConversations },
    { count: totalMessages },
  ] = await Promise.all([
    supabase.from("conversations").select("*", { count: "exact", head: true }),
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("messages").select("*", { count: "exact", head: true }),
  ])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Conversations"
          value={totalConversations ?? 0}
        />
        <MetricCard
          title="Open Conversations"
          value={openConversations ?? 0}
        />
        <MetricCard
          title="New Conversations"
          value={newConversations ?? 0}
        />
        <MetricCard
          title="Total Messages"
          value={totalMessages ?? 0}
        />
      </div>
    </main>
  )
}

function MetricCard({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="rounded-lg border bg-background p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
