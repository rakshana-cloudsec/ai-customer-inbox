import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

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

    const { data: conversation, error: convoError } =
      await supabaseServer
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

    const { error: msgError } = await supabaseServer
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
