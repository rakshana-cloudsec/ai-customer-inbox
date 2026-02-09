"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

type Conversation = {
  id: string
  subject: string
  channel: string
  priority: string
  status: string
}

type Message = {
  id: string
  sender: string
  content: string
  created_at: string
}

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params?.id as string

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!conversationId) return

    async function loadData() {
      setLoading(true)

      const { data: convo, error: convoError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single()

      if (convoError) {
        setError(convoError.message)
        setLoading(false)
        return
      }

      setConversation(convo)

      const { data: msgs, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (msgError) {
        setError(msgError.message)
        setLoading(false)
        return
      }

      setMessages(msgs ?? [])
      setLoading(false)
    }

    loadData()
  }, [conversationId])

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return

    const { error: insertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender: "Agent",
        content: reply,
        role: "agent",
      })

    if (insertError) {
      alert(insertError.message)
      return
    }

    await supabase
      .from("conversations")
      .update({ status: "open" })
      .eq("id", conversationId)

    setReply("")

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    setMessages(msgs ?? [])
  }

  if (loading) {
    return (
      <main className="p-8 text-muted-foreground">
        Loading conversation…
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-8 text-red-600">
        Error: {error}
      </main>
    )
  }

  if (!conversation) {
    return (
      <main className="p-8 text-muted-foreground">
        Conversation not found
      </main>
    )
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        {conversation.subject}
      </h1>

      <p className="text-muted-foreground mb-6">
        Channel: {conversation.channel} · Priority: {conversation.priority} · Status: {conversation.status}
      </p>

      <div className="space-y-4 mb-8">
        {messages.length === 0 && (
          <p className="text-muted-foreground">
            No messages yet
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="rounded border p-4"
          >
            <div className="text-sm text-muted-foreground mb-1">
              {msg.sender} · {new Date(msg.created_at).toLocaleString()}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendReply} className="space-y-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply…"
          rows={4}
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={!reply.trim()}
          className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          Send reply
        </button>
      </form>
    </main>
  )
}
