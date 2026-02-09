"use client"

import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Conversation = {
  id: string
  subject: string
  channel: string
  priority: string
  status: string
}

function priorityVariant(priority: string) {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "secondary"
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "new":
      return "default"
    case "open":
      return "secondary"
    case "closed":
      return "outline"
    default:
      return "secondary"
  }
}

export default function InboxPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    async function loadConversations() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false })

      setConversations(data ?? [])
    }

    loadConversations()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {conversations.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No conversations yet — new customer messages will appear here automatically.
              </TableCell>
            </TableRow>
          )}

          {conversations.map((c) => (
            <TableRow
              key={c.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => router.push(`/inbox/${c.id}`)}
            >
              <TableCell className="font-medium">
                {c.subject ?? "No subject"}
              </TableCell>
              <TableCell>{c.channel}</TableCell>
              <TableCell>
                <Badge variant={priorityVariant(c.priority)}>
                  {c.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(c.status)}>
                  {c.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
