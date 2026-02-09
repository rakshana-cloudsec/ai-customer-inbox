import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { from, subject, content } = body

    if (!from || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // Create conversation
    const { data: conversation, error: convoError } = await supabase
      .from("conversations")
      .insert({
        channel: "email",
        subject: subject ?? "(No subject)",
        status: "new",
        priority: "medium",
      })
      .select()
      .single()

    if (convoError) {
      return NextResponse.json(
        { error: convoError.message },
        { status: 500 }
      )
    }

    // Insert message
    const { error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender: from,
        content,
        role: "user",
      })

    if (msgError) {
      return NextResponse.json(
        { error: msgError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
